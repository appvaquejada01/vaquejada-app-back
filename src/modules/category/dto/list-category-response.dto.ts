import { ApiProperty } from '@nestjs/swagger';

import { Category } from 'src/entities';

import { CategoryNameEnum } from '../enums';

export class CategoryResponseDto {
  @ApiProperty({ description: 'ID da categoria' })
  id: string;

  @ApiProperty({ enum: CategoryNameEnum, description: 'Nome da categoria' })
  name: CategoryNameEnum;

  @ApiProperty({ description: 'Descrição da categoria', required: false })
  description?: string;

  @ApiProperty({ description: 'Regras específicas', required: false })
  rules?: string;

  @ApiProperty({ description: 'Indica se a categoria está ativa' })
  isActive: boolean;

  static fromEntity(entity: Category): CategoryResponseDto {
    const response = new CategoryResponseDto();

    response.id = entity.id;
    response.name = entity.name;
    response.rules = entity.rules;
    response.isActive = entity.isActive;
    response.description = entity.description;

    return response;
  }
}
