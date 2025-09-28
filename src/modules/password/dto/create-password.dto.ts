import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePasswordDto {
  @ApiProperty({ description: 'ID do evento' })
  @IsUUID()
  eventId: string;

  @ApiProperty({ description: 'ID da categoria' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: 'Preço' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Senha inicial' })
  @IsNumber()
  initialPassword: number;

  @ApiProperty({ description: 'Senha final' })
  @IsNumber()
  finalPassword: number;
}
