import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ConflictException } from '@nestjs/common';

import { Category } from 'src/entities';
import { InsertQueryResponse } from 'src/shared/types/typeorm';

import { CreateCategoryDto, CreateCategoryResponseDto } from '../dto';

@Injectable()
export class CreateCategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    dto: CreateCategoryDto,
    userId: string,
  ): Promise<CreateCategoryResponseDto> {
    await this.checkExistingCategory(dto.name);

    const savedCategory = await this.insertCategory(dto, userId);

    return CreateCategoryResponseDto.fromEntity(savedCategory);
  }

  private async checkExistingCategory(name: string): Promise<void> {
    const existingCategory = await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = LOWER(:name)', { name })
      .getOne();

    if (existingCategory) {
      throw new ConflictException(
        `Já existe uma categoria com o nome '${name}'`,
      );
    }
  }

  private async insertCategory(
    dto: CreateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const [category]: InsertQueryResponse<Category> =
      await this.categoryRepository.query(
        `
      INSERT INTO 
        categories 
        ("createdAt", "createdUserId", "createdFunctionName", name, description, rules)
      VALUES 
        (NOW(), $1, 'CreateCategoryService.insertCategory', $2, $3, $4)
      RETURNING *;`,
        [userId, dto.name, dto.description, dto.rules],
      );

    return category;
  }
}
