import { Subscription } from 'src/entities';
import { SubscriptionStatus } from '../enum';

export class GetSubscriptionDto {
  id: string;
  runner: string;
  event: string;
  category: string;
  confirmedAt: string;
  subscribedAt: string;
  status: SubscriptionStatus;

  static fromEntity(subscription: Subscription): GetSubscriptionDto {
    const dto = new GetSubscriptionDto();

    dto.id = subscription.id;
    dto.status = subscription.status;
    dto.runner = subscription.user.name;
    dto.event = subscription.event.name;
    dto.category = subscription.category.name;
    dto.confirmedAt = subscription.confirmedAt?.toISOString();
    dto.subscribedAt = subscription.subscribedAt.toISOString();

    return dto;
  }
}

export class ListSubscriptionDto {
  id: string;
  runner: string;
  event: string;
  category: string;
  subscribedAt: string;
  status: SubscriptionStatus;

  static fromEntity(subscription: Subscription): ListSubscriptionDto {
    const dto = new ListSubscriptionDto();

    dto.id = subscription.id;
    dto.status = subscription.status;
    dto.runner = subscription.user.name;
    dto.event = subscription.event.name;
    dto.category = subscription.category.name;
    dto.subscribedAt = subscription.subscribedAt.toISOString();

    return dto;
  }
}
