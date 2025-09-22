import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Category } from 'src/entities/category.entity';

import { CategoryResponseDto } from '../dto';

@Injectable()
export class GetCategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .getOne();

    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }

    return CategoryResponseDto.fromEntity(category);
  }
}
