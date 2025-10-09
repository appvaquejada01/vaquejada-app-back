import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Subscription } from 'src/entities';
import { QueryListSubscriptionDto, ListSubscriptionDto } from '../dto';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { UserRoleEnum } from 'src/modules/user/enums';

@Injectable()
export class ListSubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(
    query: QueryListSubscriptionDto,
    user: AuthenticatedUser,
  ): Promise<ListSubscriptionDto[]> {
    const queryBuilder = this.createQueryBuilder(query, user);

    const listSubscriptions = await queryBuilder.getMany();

    const subscriptionsDto = listSubscriptions.map((subscription) =>
      ListSubscriptionDto.fromEntity(subscription),
    );

    return subscriptionsDto;
  }

  private createQueryBuilder(
    query: QueryListSubscriptionDto,
    user: AuthenticatedUser,
  ): SelectQueryBuilder<Subscription> {
    const { userId, eventId, category } = query;

    const queryBuilder = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.user', 'user')
      .leftJoinAndSelect('subscription.event', 'event')
      .leftJoinAndSelect('subscription.category', 'category')
      .leftJoinAndSelect('subscription.passwords', 'password');

    if (user.role === UserRoleEnum.RUNNER) {
      queryBuilder.andWhere('user.id = :userId', { userId: user.userId });

      return queryBuilder;
    }

    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    if (eventId) {
      queryBuilder.andWhere('event.id = :eventId', { eventId });
    }

    if (category) {
      queryBuilder.andWhere('category.name = :category', { category });
    }

    return queryBuilder;
  }
}
