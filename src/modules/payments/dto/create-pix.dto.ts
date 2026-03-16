import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ArrayMinSize, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePixDto {
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

  @ApiProperty({ description: 'Email do pagador', example: 'cliente@email.com' })
  @IsEmail()
  @IsString() @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Nome do pagador', example: 'João' })
  @IsString() @IsOptional()
  first_name?: string;

  @ApiPropertyOptional({ description: 'Sobrenome do pagador', example: 'Silva' })
  @IsString() @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({ description: 'Tipo de documento (CPF, CNPJ)', example: 'CPF' })
  @IsString() @IsOptional()
  doc_type?: string;

  @ApiPropertyOptional({ description: 'Número do documento', example: '12345678900' })
  @IsString() @IsOptional()
  doc_number?: string;
}
