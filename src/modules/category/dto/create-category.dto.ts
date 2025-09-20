import { IsString, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { CategoryNameEnum } from '../enums';
import { Category } from 'src/entities';

export class CreateCategoryDto {
  @IsEnum(CategoryNameEnum)
  name: CategoryNameEnum;

  @IsString()
  observation: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;

  @IsNumber()
  passQuantity: number;

  @IsNumber()
  inscriptionPrice: number;
}

export class CreateCategoryResponseDto {
  id: string;
  name: CategoryNameEnum;
  observation: string;
  startAt: string;
  endAt: string;
  passQuantity: number;
  inscriptionPrice: number;

  static fromEntity(category: Category): CreateCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      observation: category.observation,
      startAt: category.startAt,
      endAt: category.endAt,
      passQuantity: category.passQuantity,
      inscriptionPrice: category.inscriptionPrice,
    };
  }
}
