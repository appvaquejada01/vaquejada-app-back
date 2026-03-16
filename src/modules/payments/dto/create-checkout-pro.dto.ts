import { IsArray, IsNotEmpty, IsNumber, IsString, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutProDto {
  @ApiProperty({ description: 'ID do evento', example: 'uuid-do-evento' })
  @IsString() @IsNotEmpty()
  eventId: string;

  @ApiProperty({ description: 'ID da categoria', example: 'uuid-da-categoria' })
  @IsString() @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'IDs das senhas a serem compradas',
    example: ['uuid-senha-1', 'uuid-senha-2'],
    type: [String]
  })
  @IsArray() @ArrayMinSize(1)
  passwordIds: string[];

  @ApiProperty({ description: 'Valor total em reais', example: 150.00 })
  @IsNumber()
  total: number;
}
