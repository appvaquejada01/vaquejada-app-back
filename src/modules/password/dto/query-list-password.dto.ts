import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class QueryListPasswordDto {
  @ApiProperty({ description: 'ID do evento' })
  @IsUUID()
  eventId: string;

  @ApiProperty({ description: 'ID da categoria' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
