import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { Category } from 'src/entities';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;

  @IsOptional()
  @IsNumber()
  passQuantity?: number;

  @IsOptional()
  @IsNumber()
  inscriptionPrice?: number;
}

export class UpdateCategoryResponseDto {
  id: string;
  name: string;
  observation: string;
  startAt: string;
  endAt: string;
  passQuantity: number;
  inscriptionPrice: number;

  static fromEntity(category: Category): UpdateCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      startAt: category.startAt,
      endAt: category.endAt,
      observation: category.observation,
      passQuantity: category.passQuantity,
      inscriptionPrice: category.inscriptionPrice,
    };
  }
}
