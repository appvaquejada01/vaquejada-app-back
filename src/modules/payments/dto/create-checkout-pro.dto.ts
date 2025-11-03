import { IsArray, IsNotEmpty, IsNumber, IsString, ArrayMinSize } from 'class-validator';

export class CreateCheckoutProDto {
  @IsString() @IsNotEmpty()
  eventId: string;

  @IsString() @IsNotEmpty()
  categoryId: string;

  @IsArray() @ArrayMinSize(1)
  passwordIds: string[];

  @IsNumber()
  total: number;
}
