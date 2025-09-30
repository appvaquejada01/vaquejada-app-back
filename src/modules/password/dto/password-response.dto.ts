import { Password } from 'src/entities';
import { PasswordStatusEnum } from '../enums';

export class PasswordResponseDto {
  id: string;
  eventId: string;
  categoryId: string;
  price: number;
  number: string;
  status: PasswordStatusEnum;
  soldAt: Date;

  static fromEntity(entity: Password): PasswordResponseDto {
    const dto = new PasswordResponseDto();

    dto.id = entity.id;
    dto.eventId = entity.eventId;
    dto.categoryId = entity.categoryId;
    dto.price = entity.price;
    dto.number = entity.number;
    dto.status = entity.status;
    dto.soldAt = entity.soldAt;

    return dto;
  }
}
