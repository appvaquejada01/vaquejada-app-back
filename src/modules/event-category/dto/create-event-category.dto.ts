import {
  Min,
  IsInt,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsPositive,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({ description: 'Senha inicial da categoria', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  initialPassword?: number;

  @ApiPropertyOptional({ description: 'Senha final da categoria', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  finalPassword?: number;

  @ApiPropertyOptional({ description: 'Quantidade de boi por categoria', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  cattleQuantity?: number;

  @ApiPropertyOptional({ description: 'Premiação da categoria', default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  prize?: number;

  @ApiPropertyOptional({
    description: 'Categoria está ativa',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
