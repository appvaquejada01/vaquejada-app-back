import { Password, Subscription } from 'src/entities';
import { SubscriptionStatus } from '../enum';
import { EventResponseDto } from 'src/modules/event/dto';
import { CategoryResponseDto } from 'src/modules/category/dto';
import { GetUserResponseDto } from 'src/modules/user/dto';
import { PasswordResponseDto } from 'src/modules/password/dto';

export class GetSubscriptionDto {
  id: string;
  runner: string;
  event: string;
  category: string;
  confirmedAt: string;
  subscribedAt: string;
  status: SubscriptionStatus;
  passwords: PasswordResponseDto[];
  passwordPrice: number;

  static fromEntity(subscription: Subscription): GetSubscriptionDto {
    const dto = new GetSubscriptionDto();

    const price = subscription.passwords.reduce((total, password) => {
      const priceValue = parseFloat(password.price as any) || 0;
      return total + priceValue;
    }, 0);

    dto.id = subscription.id;
    dto.status = subscription.status;
    dto.runner = subscription.user.name;
    dto.event = subscription.event.name;
    dto.category = subscription.category.name;
    dto.passwords = subscription.passwords.map((password) =>
      PasswordResponseDto.fromEntity(password),
    );
    dto.passwordPrice = price;
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
  passwords: PasswordResponseDto[];
  passwordPrice: number;

  static fromEntity(subscription: Subscription): ListSubscriptionDto {
    const dto = new ListSubscriptionDto();

    const price = subscription.passwords.reduce((total, password) => {
      const priceValue = parseFloat(password.price as any) || 0;
      return total + priceValue;
    }, 0);

    dto.id = subscription.id;
    dto.status = subscription.status;
    dto.runner = GetUserResponseDto.fromEntity(subscription.user);
    dto.event = EventResponseDto.fromEntity(subscription.event);
    dto.category = CategoryResponseDto.fromEntity(subscription.category);
    dto.passwords = subscription.passwords.map((password) =>
      PasswordResponseDto.fromEntity(password),
    );
    dto.passwordPrice = price;
    dto.subscribedAt = subscription.subscribedAt.toISOString();

    return dto;
  }
}
