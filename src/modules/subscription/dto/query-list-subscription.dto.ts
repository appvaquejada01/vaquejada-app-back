import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CategoryNameEnum } from 'src/modules/category/enums';

export class QueryListSubscriptionDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID('4')
  eventId?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(CategoryNameEnum)
  category?: CategoryNameEnum;

  @ApiProperty()
  @IsOptional()
  @IsUUID('4')
  userId?: string;
}
