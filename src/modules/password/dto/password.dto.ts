import { Password, Subscription } from 'src/entities';
import { PasswordStatusEnum } from '../enums';

export class PasswordDto {
  id: string;
  number: number;
  soldAt: string;
  eventId: string;
  categoryId: string;
  subscriptionId: string;
  passwordStatus: PasswordStatusEnum;

  static fromEntity(entity: Password, subscription: Subscription): PasswordDto {
    return {
      id: entity.id,
      eventId: entity.eventId,
      number: Number(entity.number),
      passwordStatus: entity.status,
      categoryId: entity.categoryId,
      subscriptionId: subscription.id,
      soldAt: entity.soldAt.toISOString(),
    };
  }
}
