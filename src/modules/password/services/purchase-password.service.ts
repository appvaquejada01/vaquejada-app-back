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
import { In } from 'typeorm';

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
  ): Promise<PasswordDto[]> {
    const passwords = await this.validateEntities(purchaseDto);
    await this.validateExistingSubscription(purchaseDto, userId);

    const subscription = await this.insertSubscription(purchaseDto, userId);
    const updatedPassword = await this.updateManyPasswordStatus(
      passwords,
      userId,
    );

    await this.insertEventRunners(purchaseDto.eventId, userId);

    return updatedPassword.map((password) =>
      PasswordDto.fromEntity(password, subscription),
    );
  }

  private async validateEntities(
    purchaseDto: PurchasePasswordDto,
  ): Promise<Password[]> {
    const { eventId, categoryId, passwordIds } = purchaseDto;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found');

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) throw new NotFoundException('Category not found');

    const passwords = await this.passwordRepository.find({
      where: { id: In(passwordIds) },
    });

    if (passwords.length === 0)
      throw new NotFoundException('Passwords not found');

    return passwords;
  }

  private async validateExistingSubscription(
    purchaseDto: PurchasePasswordDto,
    userId: string,
  ): Promise<void> {
    const { eventId, categoryId, passwordIds } = purchaseDto;

    const subscription = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select([
        'subscription.id',
        'subscription.status',
        'subscription.userId',
        'subscription.eventId',
        'subscription.categoryId',
      ])
      .leftJoin('subscription.passwords', 'password')
      .where('subscription.userId = :userId', { userId })
      .andWhere('subscription.eventId = :eventId', { eventId })
      .andWhere('subscription.categoryId = :categoryId', { categoryId })
      .andWhere('password.id IN (:...passwordIds)', { passwordIds })
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
    const { eventId, categoryId, passwordIds } = purchaseDto;

    const passwords = await this.passwordRepository.find({
      where: { id: In(passwordIds) },
    });

    const subscription = this.subscriptionRepository.create({
      userId: userId,
      eventId: eventId,
      categoryId: categoryId,
      passwords: passwords,
      status: SubscriptionStatus.CONFIRMED,
      subscribedAt: new Date(),
      createdAt: new Date(),
      createdUserId: userId,
      createdFunctionName: 'PurchasePasswordService.purchase',
    });

    return this.subscriptionRepository.save(subscription);
  }

  private async updateManyPasswordStatus(
    passwords: Password[],
    userId: string,
  ): Promise<Password[]> {
    const promises = passwords.map((password) =>
      this.updatePasswordStatus(password, userId),
    );

    return Promise.all(promises);
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

  private async insertEventRunners(
    eventId: string,
    userId: string,
  ): Promise<void> {
    await this.eventRepository.query(
      `INSERT INTO "event_runners"("event_id", "user_id") VALUES ($1, $2)`,
      [eventId, userId],
    );
  }
}
