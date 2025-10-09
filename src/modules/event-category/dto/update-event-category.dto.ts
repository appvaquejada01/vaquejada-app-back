import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsInt,
  IsUUID,
} from 'class-validator';

export class UpdateEventCategoryDto {
  @ApiProperty({ description: 'ID do evento' })
  @IsUUID()
  eventId: string;

  @ApiProperty({ description: 'ID da categoria' })
  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;

  @IsOptional()
  @IsInt()
  maxRunners?: number;

  @IsOptional()
  @IsInt()
  currentRunners?: number;

  @IsOptional()
  @IsInt()
  passwordLimit?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
