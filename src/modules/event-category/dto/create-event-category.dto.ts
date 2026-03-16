import {
  Min,
  IsInt,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventCategoryDto {
  @ApiProperty({ description: 'ID do evento' })
  @IsUUID()
  eventId: string;

  @ApiProperty({ description: 'ID da categoria' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: 'Preço da categoria', example: 99.9 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Data e hora de início (timestamptz)' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ description: 'Data e hora de término (timestamptz)' })
  @IsDateString()
  endAt: string;

  @ApiProperty({ description: 'Número máximo de participantes' })
  @IsInt()
  @IsPositive()
  maxRunners: number;

  @ApiProperty({ description: 'Limite de senhas da categoria' })
  @IsInt()
  @IsPositive()
  passwordLimit: number;

  @ApiProperty({ description: 'Senha inicial da categoria' })
  @IsInt()
  @IsPositive()
  initialPassword: number;

  @ApiProperty({ description: 'Senha final da categoria' })
  @IsInt()
  @IsPositive()
  finalPassword: number;

  @ApiProperty({ description: 'Quantidade de boi por categoria', required: false, default: 0 })
  @IsInt()
  @Min(0)
  cattleQuantity?: number;

  @ApiProperty({ description: 'Premiação da categoria', required: false, default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  prize?: number;

  @ApiProperty({
    description: 'Categoria está ativa',
    required: false,
    default: true,
  })
  @IsBoolean()
  isActive?: boolean;
}
