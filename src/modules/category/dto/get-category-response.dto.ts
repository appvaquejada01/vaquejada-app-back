import { Category } from 'src/entities/category.entity';

export class GetCategoryResponseDto {
  id: string;
  name: string;
  observation: string;
  startAt: string;
  endAt: string;
  passQuantity: number;
  inscriptionPrice: number;

  static fromEntity(category: Category): GetCategoryResponseDto {
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
