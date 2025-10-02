import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PasswordStatusEnum } from '../enums';

export class QueryListPasswordDto {
  @ApiProperty({ description: 'ID do evento' })
  @IsUUID()
  eventId: string;

  @ApiProperty({ description: 'ID da categoria' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ description: 'Status da senha' })
  @IsEnum(PasswordStatusEnum)
  @IsOptional()
  status?: PasswordStatusEnum;
}
