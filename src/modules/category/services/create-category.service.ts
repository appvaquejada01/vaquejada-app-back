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

  async create(dto: CreateCategoryDto): Promise<CreateCategoryResponseDto> {
    await this.checkExistingCategory(dto.name);

    const savedCategory = await this.insertCategory(dto);

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

  private async insertCategory(dto: CreateCategoryDto): Promise<Category> {
    const [category]: InsertQueryResponse<Category> =
      await this.categoryRepository.query(
        `
      INSERT INTO 
        category 
        (name, description, rules)
      VALUES 
        ($1, $2, $3)
      RETURNING *;`,
        [dto.name, dto.description, dto.rules],
      );

    return category;
  }
}
