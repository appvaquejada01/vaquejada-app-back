import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Event } from 'src/entities';
import { EventStatusEnum } from '../enums';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;

  @IsOptional()
  @IsDateString()
  purchaseClosedAt?: string;

  @IsOptional()
  @IsNumber()
  inscriptionPrice?: number;

  @IsOptional()
  @IsNumber()
  inscriptionLimit?: number;

  @IsOptional()
  @IsEnum(EventStatusEnum)
  status?: EventStatusEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  static fromEntity(entity: Event): UpdateEventDto {
    const dto = new UpdateEventDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.startAt = entity.startAt;
    dto.endAt = entity.endAt;
    dto.purchaseClosedAt = entity.purchaseClosedAt;
    dto.inscriptionLimit = entity.inscriptionLimit;
    dto.inscriptionPrice = entity.inscriptionPrice;
    dto.status = entity.status;
    dto.address = entity.address;
    dto.city = entity.city;
    dto.state = entity.state;
    dto.description = entity.description;

    return dto;
  }
}
