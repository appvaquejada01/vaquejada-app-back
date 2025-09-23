import {
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsInt,
} from 'class-validator';

export class UpdateEventCategoryDto {
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
  @IsBoolean()
  isActive?: boolean;
}
