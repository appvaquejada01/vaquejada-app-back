import {
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsUrl,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventStatusEnum } from '../enums/event-status.enum';

export class CreateEventDto {
  @ApiProperty({ description: 'Nome do evento', minLength: 3, maxLength: 200 })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Data e hora de início do evento' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ description: 'Data e hora de término do evento' })
  @IsDateString()
  endAt: string;

  @ApiProperty({ description: 'Data limite para compra de números' })
  @IsDateString()
  purchaseClosedAt: string;

  @ApiProperty({ enum: EventStatusEnum, description: 'Status do evento' })
  @IsEnum(EventStatusEnum)
  status: EventStatusEnum;

  @ApiPropertyOptional({ description: 'Endereço do evento', maxLength: 500 })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({ description: 'Cidade do evento', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'Estado do evento (UF)', maxLength: 2 })
  @IsString()
  @IsOptional()
  @MaxLength(2)
  state?: string;

  @ApiProperty({ description: 'Descrição do evento', maxLength: 1000 })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiPropertyOptional({ description: 'URL do banner do evento' })
  @IsUrl()
  @IsOptional()
  bannerUrl?: string;

  @ApiPropertyOptional({ description: 'Se o evento é público' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
