import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateQueryResponse } from 'src/shared/types/typeorm';
import { SubscriptionStatus } from 'src/modules/subscription/enum';
import { Event, Category, Password, Subscription } from 'src/entities';

import { PasswordStatusEnum } from '../enums';
import { PasswordDto, PurchasePasswordDto } from '../dto';

@Injectable()
export class PurchasePasswordService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  public async purchase(
    purchaseDto: PurchasePasswordDto,
    userId: string,
  ): Promise<PasswordDto> {
    const password = await this.validateEntities(purchaseDto);
    await this.validateExistingSubscription(purchaseDto, userId);

    const subscription = await this.insertSubscription(purchaseDto, userId);
    const updatedPassword = await this.updatePasswordStatus(password, userId);

    return PasswordDto.fromEntity(updatedPassword, subscription);
  }

  private async validateEntities(
    purchaseDto: PurchasePasswordDto,
  ): Promise<Password> {
    const { eventId, categoryId, passwordId } = purchaseDto;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found');

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) throw new NotFoundException('Category not found');

    const password = await this.passwordRepository.findOne({
      where: { id: passwordId },
    });

    if (!password) throw new NotFoundException('Password not found');

    return password;
  }

  private async validateExistingSubscription(
    purchaseDto: PurchasePasswordDto,
    userId: string,
  ): Promise<void> {
    const { eventId, categoryId, passwordId } = purchaseDto;

    const subscription = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select([
        'subscription.id',
        'subscription.status',
        'subscription.userId',
        'subscription.eventId',
        'subscription.categoryId',
        'subscription.passwordId',
      ])
      .where('subscription.userId = :userId', { userId })
      .andWhere('subscription.eventId = :eventId', { eventId })
      .andWhere('subscription.categoryId = :categoryId', { categoryId })
      .andWhere('subscription.passwordId = :passwordId', { passwordId })
      .andWhere('subscription.status <> :status', {
        status: SubscriptionStatus.CANCELLED,
      })
      .getOne();

    if (subscription)
      throw new ConflictException('Subscription already exists');
  }

  private async insertSubscription(
    purchaseDto: PurchasePasswordDto,
    userId: string,
  ): Promise<Subscription> {
    const { eventId, categoryId, passwordId } = purchaseDto;

    const subscription = this.subscriptionRepository.create({
      userId: userId,
      eventId: eventId,
      categoryId: categoryId,
      passwordId: passwordId,
      status: SubscriptionStatus.PENDING, // alterar para "confirmado" após pagamento
      subscribedAt: new Date(),
      createdAt: new Date(),
      createdUserId: userId,
      createdFunctionName: 'PurchasePasswordService.purchase',
    });

    return this.subscriptionRepository.save(subscription);
  }

  private async updatePasswordStatus(
    password: Password,
    userId: string,
  ): Promise<Password> {
    if (password.status !== PasswordStatusEnum.AVAILABLE) {
      throw new ConflictException('Password is not available');
    }

    const [[updatedPassword]]: UpdateQueryResponse<Password> =
      await this.passwordRepository.query(
        `UPDATE 
          passwords
        SET 
          status = $1, 
          "soldAt" = NOW(), 
          "updatedAt" = NOW(), 
          "updatedUserId" = $2, 
          "updatedFunctionName" = $3 
        WHERE 
          id = $4 
        RETURNING *`,
        [
          PasswordStatusEnum.RESERVED,
          userId,
          'PurchasePasswordService.purchase',
          password.id,
        ],
      );

    return updatedPassword;
  }
}
