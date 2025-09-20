import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Category } from 'src/entities/category.entity';
import { ConnectionTypeEnum } from 'src/utils/database';
import { UpdateQueryResponse } from 'src/shared/types/typeorm';

import { UpdateCategoryDto, UpdateCategoryResponseDto } from '../dto';

@Injectable()
export class UpdateCategoryService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
  ) {}

  async update(
    id: string,
    dto: UpdateCategoryDto,
    userId: string,
  ): Promise<UpdateCategoryResponseDto> {
    const category = await this.findCategoryById(id);

    const updatedCategory = await this.updateCategory(category.id, dto, userId);

    return UpdateCategoryResponseDto.fromEntity(updatedCategory);
  }

  private async findCategoryById(categoryId: string): Promise<Category> {
    const category = await this.dataSource
      .createQueryBuilder(Category, 'category')
      .where('category.id = :categoryId', { categoryId })
      .getOne();

    if (!category) throw new NotFoundException('Categoria não encontrada');

    return category;
  }

  private async updateCategory(
    categoryId: string,
    dto: UpdateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const [[category]]: UpdateQueryResponse<Category> =
      await this.dataSource.query(
        `
      UPDATE 
        "categories" 
      SET
        name = $1,
        observation = $2,
        "startAt" = $3,
        "endAt" = $4,
        "passQuantity" = $5,
        "inscriptionPrice" = $6,
        "updatedAt" = NOW(),
        "updatedUserId" = $7,
        "updatedFunctionName" = 'UpdateCategoryService.updateCategory'
      WHERE
        id = $8
      RETURNING *`,
        [
          dto.name,
          dto.observation,
          dto.startAt,
          dto.endAt,
          dto.passQuantity,
          dto.inscriptionPrice,
          userId,
          categoryId,
        ],
      );

    return category;
  }
}
