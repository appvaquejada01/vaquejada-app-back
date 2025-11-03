import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ArrayMinSize } from 'class-validator';

export class CreatePixDto {
  @IsString() @IsNotEmpty()
  eventId: string;

  @IsString() @IsNotEmpty()
  categoryId: string;

  @IsArray() @ArrayMinSize(1)
  passwordIds: string[];

  @IsNumber()
  total: number;

  @IsString() @IsNotEmpty()
  email: string;

  @IsString() @IsOptional()
  first_name?: string;

  @IsString() @IsOptional()
  last_name?: string;

  @IsString() @IsOptional()
  doc_type?: string;

  @IsString() @IsOptional()
  doc_number?: string;
}
