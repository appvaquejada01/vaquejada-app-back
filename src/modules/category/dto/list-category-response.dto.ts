import { Category } from 'src/entities/category.entity';

export class ListCategoryResponseDto {
  id: string;
  name: string;
  observation: string;

  static fromEntity(category: Category): ListCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      observation: category.observation,
    };
  }
}
