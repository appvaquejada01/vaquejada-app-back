import { Subscription } from 'src/entities';
import { SubscriptionStatus } from '../enum';
import { EventResponseDto } from 'src/modules/event/dto';
import { CategoryResponseDto } from 'src/modules/category/dto';
import { GetUserResponseDto } from 'src/modules/user/dto';

export class GetSubscriptionDto {
  id: string;
  runner: string;
  event: string;
  category: string;
  confirmedAt: string;
  subscribedAt: string;
  status: SubscriptionStatus;
  password: string;
  passwordPrice: number;

  static fromEntity(subscription: Subscription): GetSubscriptionDto {
    const dto = new GetSubscriptionDto();

    dto.id = subscription.id;
    dto.status = subscription.status;
    dto.runner = subscription.user.name;
    dto.event = subscription.event.name;
    dto.category = subscription.category.name;
    dto.password = subscription.password.number;
    dto.passwordPrice = subscription.password.price;
    dto.confirmedAt = subscription.confirmedAt?.toISOString();
    dto.subscribedAt = subscription.subscribedAt.toISOString();

    return dto;
  }
}

export class ListSubscriptionDto {
  id: string;
  runner: GetUserResponseDto;
  event: EventResponseDto;
  category: CategoryResponseDto;
  subscribedAt: string;
  status: SubscriptionStatus;
  password: string;
  passwordPrice: number;

  static fromEntity(subscription: Subscription): ListSubscriptionDto {
    const dto = new ListSubscriptionDto();

    dto.id = subscription.id;
    dto.status = subscription.status;
    dto.runner = GetUserResponseDto.fromEntity(subscription.user);
    dto.event = EventResponseDto.fromEntity(subscription.event);
    dto.category = CategoryResponseDto.fromEntity(subscription.category);
    dto.password = subscription.password.number;
    dto.passwordPrice = subscription.password.price;
    dto.subscribedAt = subscription.subscribedAt.toISOString();

    return dto;
  }
}
