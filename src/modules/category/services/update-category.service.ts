import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from 'src/entities/category.entity';
import { UpdateQueryResponse } from 'src/shared/types/typeorm';

import { CategoryResponseDto, UpdateCategoryDto } from '../dto';

@Injectable()
export class UpdateCategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      await this.checkExistingCategory(updateCategoryDto.name, id);
    }

    const updatedCategory = await this.updateCategory(
      id,
      updateCategoryDto,
      userId,
    );

    return CategoryResponseDto.fromEntity(updatedCategory);
  }

  private async checkExistingCategory(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name = :name', { name });

    if (excludeId) {
      queryBuilder.andWhere('category.id != :excludeId', { excludeId });
    }

    const existingCategory = await queryBuilder.getOne();

    if (existingCategory) {
      throw new ConflictException(
        `Já existe uma categoria com o nome '${name}'`,
      );
    }
  }

  private async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const { name, description } = updateCategoryDto;

    const [[result]]: UpdateQueryResponse<Category> =
      await this.categoryRepository.query(
        `
      UPDATE 
        categories
      SET
        "updatedAt" = NOW(),
        "updatedUserId" = $4,
        "updatedFunction" = 'UpdateCategoryService.updateCategory',
        name = COALESCE($1, name),
        description = COALESCE($2, description)
      WHERE 
        id = $3
      RETURNING *`,
        [name ?? null, description ?? null, id, userId],
      );

    return result;
  }
}
