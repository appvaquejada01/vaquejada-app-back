import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Category } from 'src/entities/category.entity';
import { ConnectionTypeEnum } from 'src/utils/database';

import { ListCategoryResponseDto, QueryListCategoryDto } from '../dto';

@Injectable()
export class ListCategoryService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
  ) {}

  async list(query: QueryListCategoryDto): Promise<ListCategoryResponseDto[]> {
    const qb = this.dataSource.createQueryBuilder(Category, 'category');

    if (query.name) {
      qb.andWhere('category.name ILIKE :name', { name: `%${query.name}%` });
    }

    const categories = await qb.getMany();

    return categories.map(ListCategoryResponseDto.fromEntity);
  }
}
