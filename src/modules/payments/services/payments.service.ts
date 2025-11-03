import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Subscription, Password } from 'src/entities';
import { Payment } from 'src/entities/payment.entity';
import { SubscriptionStatus } from 'src/modules/subscription/enum';
import { PasswordStatusEnum } from 'src/modules/password/enums';
import { MP_CLIENT } from './mercadopago.client';
import { PaymentStatusEnum } from '../enums/payment-status.enum';

type MPClient = {
  payments: {
    create: (args: { body: any }) => Promise<any>;
  };
  preferences: {
    create: (args: { body: any }) => Promise<any>;
  };
};

@Injectable()
export class PaymentsService {
  private readonly isSandbox = process.env.MP_SANDBOX === 'true';

  constructor(
    @InjectRepository(Subscription) private subsRepo: Repository<Subscription>,
    @InjectRepository(Password) private passRepo: Repository<Password>,
    @InjectRepository(Payment) private payRepo: Repository<Payment>,
    @Inject(MP_CLIENT) private mp: MPClient,
  ) {}

  async createCheckoutProSession(args: {
    userId: string;
    eventId: string;
    categoryId: string;
    passwordIds: string[];
    total: number;
  }) {
    const { userId, eventId, categoryId, passwordIds, total } = args;

    const passwords = await this.passRepo.find({ where: { id: In(passwordIds) } });
    if (passwords.length !== passwordIds.length) {
      throw new NotFoundException('Passwords not found');
    }
    if (passwords.some((p) => p.status !== PasswordStatusEnum.AVAILABLE)) {
      throw new ConflictException('Some passwords are not available');
    }

    const sub = await this.subsRepo.save(
      this.subsRepo.create({
        userId,
        eventId,
        categoryId,
        passwords,
        status: SubscriptionStatus.PENDING,
        subscribedAt: new Date(),
        createdAt: new Date(),
        createdUserId: userId,
        createdFunctionName: 'PaymentsService.createCheckoutProSession',
      }),
    );

    await this.passRepo
      .createQueryBuilder()
      .update()
      .set({
        status: PasswordStatusEnum.PENDING,
        updatedAt: new Date(),
        updatedUserId: userId,
        updatedFunctionName: 'PaymentsService.createCheckoutProSession',
      })
      .where({ id: In(passwordIds), status: PasswordStatusEnum.AVAILABLE })
      .execute();

    const front = (process.env.FRONT_URL || '').replace(/\/+$/, '');

    const pref = await this.mp.preferences.create({
      body: {
        items: [
          {
            title: `Senhas categoria ${categoryId}`,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: Number(total),
          },
        ],
        external_reference: sub.id,
        back_urls: {
          success: `${front}/checkout/success`,
          pending: `${front}/checkout/pending`,
          failure: `${front}/checkout/failure`,
        },
        auto_return: (process.env.MP_AUTO_RETURN_MODE as 'approved' | 'all') || 'approved',
        notification_url: process.env.MP_WEBHOOK_URL,
        payment_methods: {
          default_payment_method_id:
            process.env.MP_DEFAULT_PAYMENT_METHOD_ID || undefined,
        },
        metadata: { subscriptionId: sub.id, userId, eventId, categoryId },
      },
    });


    // Em sandbox, priorize o sandbox_init_point.
    const initPoint = this.isSandbox ? pref?.sandbox_init_point : pref?.init_point;
    if (!initPoint) {
      throw new InternalServerErrorException(
        'Falha ao gerar init_point do Checkout Pro',
      );
    }

    const pay = await this.payRepo.save(
      this.payRepo.create({
        subscriptionId: sub.id,
        gateway: 'mercadopago',
        status: PaymentStatusEnum.PENDING,
        amount: Number(total),
        currency: 'BRL',
        externalReference: sub.id,
        mpPreferenceId: pref?.id?.toString?.() ?? String(pref?.id ?? ''),
        initPoint,
        raw: pref,
      }),
    );

    return { paymentId: pay.id, subscriptionId: sub.id, initPoint };
  }

  async createPixPayment(args: {
    userId: string;
    eventId: string;
    categoryId: string;
    passwordIds: string[];
    total: number;
    payer: {
      email: string;
      first_name?: string;
      last_name?: string;
      identification?: { type: string; number: string };
    };
  }) {
    const { userId, eventId, categoryId, passwordIds, total, payer } = args;

    const passwords = await this.passRepo.find({ where: { id: In(passwordIds) } });
    if (passwords.length !== passwordIds.length) {
      throw new NotFoundException('Passwords not found');
    }
    if (passwords.some((p) => p.status !== PasswordStatusEnum.AVAILABLE)) {
      throw new ConflictException('Some passwords are not available');
    }

    const sub = await this.subsRepo.save(
      this.subsRepo.create({
        userId,
        eventId,
        categoryId,
        passwords,
        status: SubscriptionStatus.PENDING,
        subscribedAt: new Date(),
        createdAt: new Date(),
        createdUserId: userId,
        createdFunctionName: 'PaymentsService.createPixPayment',
      }),
    );

    await this.passRepo
      .createQueryBuilder()
      .update()
      .set({
        status: PasswordStatusEnum.PENDING,
        updatedAt: new Date(),
        updatedUserId: userId,
        updatedFunctionName: 'PaymentsService.createPixPayment',
      })
      .where({ id: In(passwordIds), status: PasswordStatusEnum.AVAILABLE })
      .execute();

    // Em sandbox, usar credenciais TEST-... já simula Pix.
    const result = await this.mp.payments.create({
      body: {
        transaction_amount: Number(total),
        description: `Senhas categoria ${categoryId}`,
        payment_method_id: 'pix',
        payer,
        external_reference: sub.id,
        notification_url: process.env.MP_WEBHOOK_URL,
      },
    });

    const data = result;
    const tx = data?.point_of_interaction?.transaction_data;
    const qrCode = tx?.qr_code;
    const qrCodeBase64 = tx?.qr_code_base64;

    const pay = await this.payRepo.save(
      this.payRepo.create({
        subscriptionId: sub.id,
        gateway: 'mercadopago',
        status: PaymentStatusEnum.PENDING,
        amount: Number(total),
        currency: 'BRL',
        externalReference: sub.id,
        mpPaymentId: data?.id?.toString(),
        qrCode,
        qrCodeBase64,
        raw: data,
      }),
    );

    return { paymentId: pay.id, subscriptionId: sub.id, qrCode, qrCodeBase64 };
  }

  async markApproved(externalReference: string, mpPaymentId?: string) {
    const payment = await this.payRepo.findOne({ where: { externalReference } });
    if (!payment) return;

    await this.subsRepo.update(
      { id: externalReference },
      { status: SubscriptionStatus.CONFIRMED },
    );
    const sub = await this.subsRepo.findOne({
      where: { id: externalReference },
      relations: ['passwords'],
    });

    if (sub?.passwords?.length) {
      await this.passRepo
        .createQueryBuilder()
        .update()
        .set({
          status: PasswordStatusEnum.RESERVED,
          updatedAt: new Date(),
          updatedFunctionName: 'PaymentsService.markApproved',
        })
        .where({ id: In(sub.passwords.map((p) => p.id)) })
        .execute();
    }

    await this.payRepo.update(
      { id: payment.id },
      {
        status: PaymentStatusEnum.APPROVED,
        mpPaymentId,
        updatedAt: new Date(),
      },
    );
  }

  async markClosed(
    externalReference: string,
    status:
      | PaymentStatusEnum.CANCELLED
      | PaymentStatusEnum.EXPIRED
      | PaymentStatusEnum.REJECTED,
  ) {
    const payment = await this.payRepo.findOne({ where: { externalReference } });
    if (!payment) return;

    await this.subsRepo.update(
      { id: externalReference },
      { status: SubscriptionStatus.CANCELLED },
    );
    const sub = await this.subsRepo.findOne({
      where: { id: externalReference },
      relations: ['passwords'],
    });

    if (sub?.passwords?.length) {
      await this.passRepo
        .createQueryBuilder()
        .update()
        .set({
          status: PasswordStatusEnum.AVAILABLE,
          updatedAt: new Date(),
          updatedFunctionName: 'PaymentsService.markClosed',
        })
        .where({ id: In(sub.passwords.map((p) => p.id)) })
        .execute();
    }

    await this.payRepo.update(
      { id: payment.id },
      { status, updatedAt: new Date() },
    );
  }
}
