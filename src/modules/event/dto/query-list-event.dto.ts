import {
  IsEnum,
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { EventStatusEnum } from '../enums';
import { PaginationDto } from 'src/shared/dto';

export class QueryListEventDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(EventStatusEnum)
  status?: EventStatusEnum;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
