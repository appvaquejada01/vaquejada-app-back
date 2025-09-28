import { Password, PasswordStatus } from 'src/entities';

export class PasswordResponseDto {
  id: string;
  eventId: string;
  categoryId: string;
  price: number;
  number: string;
  status: PasswordStatus;
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
