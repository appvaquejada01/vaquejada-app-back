import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ConflictException } from '@nestjs/common';

import { Category } from 'src/entities';
import { CategoryNameEnum } from '../enums';
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
    await this.checkExistingCategory(dto);

    const savedCategory = await this.insertCategory(dto, userId);

    return CreateCategoryResponseDto.fromEntity(savedCategory);
  }

  private async checkExistingCategory(dto: CreateCategoryDto): Promise<void> {
    if (dto.name === CategoryNameEnum.CUSTOM) {
      if (!dto.description) {
        throw new ConflictException(
          'Categoria personalizada exige um nome (description)',
        );
      }
      const existing = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.name = :name', { name: CategoryNameEnum.CUSTOM })
        .andWhere('LOWER(category.description) = LOWER(:description)', {
          description: dto.description,
        })
        .getOne();

      if (existing) {
        throw new ConflictException(
          `Já existe uma categoria personalizada com o nome '${dto.description}'`,
        );
      }
      return;
    }

    const existingCategory = await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = LOWER(:name)', { name: dto.name })
      .getOne();

    if (existingCategory) {
      throw new ConflictException(
        `Já existe uma categoria com o nome '${dto.name}'`,
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
