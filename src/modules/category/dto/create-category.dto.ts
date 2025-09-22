import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CategoryNameEnum } from '../enums';
import { Category } from 'src/entities';

export class CreateCategoryDto {
  @IsEnum(CategoryNameEnum)
  name: CategoryNameEnum;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  rules?: string;
}

export class CreateCategoryResponseDto {
  id: string;
  name: string;
  description: string;
  rules: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: Category): CreateCategoryResponseDto {
    const response = new CreateCategoryResponseDto();

    response.id = entity.id;
    response.name = entity.name;
    response.description = entity.description;
    response.rules = entity.rules;
    response.isActive = entity.isActive;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;

    return response;
  }
}
