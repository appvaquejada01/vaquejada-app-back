import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Category } from 'src/entities/category.entity';
import { PaginatedResponseDto, PaginationDto } from 'src/shared/dto';
import { CategoryResponseDto } from '../dto';

@Injectable()
export class ListCategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async findAll(
    paginationDto: PaginationDto,
    isActive?: boolean,
  ): Promise<PaginatedResponseDto<CategoryResponseDto>> {
    const queryBuilder = this.createQueryBuilder(paginationDto, isActive);
    const totalCategories = await this.getCount(queryBuilder);

    const listCategories = await this.addPaginate(queryBuilder, paginationDto);

    const categoriesDto = listCategories.map(CategoryResponseDto.fromEntity);

    const meta = this.buildMeta(totalCategories, paginationDto);

    return { data: categoriesDto, meta };
  }

  private createQueryBuilder(
    paginationDto: PaginationDto,
    isActive?: boolean,
  ): SelectQueryBuilder<Category> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .select([
        'category.id',
        'category.name',
        'category.isActive',
        'category.createdAt',
      ]);

    this.mapFilters(queryBuilder, paginationDto, isActive);

    return queryBuilder;
  }

  private mapFilters(
    queryBuilder: SelectQueryBuilder<Category>,
    paginationDto: PaginationDto,
    isActive?: boolean,
  ) {
    const { search } = paginationDto;

    if (typeof isActive === 'boolean') {
      queryBuilder.andWhere('category.isActive = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere('unaccent(category.name) ILIKE unaccent(:search)', {
        search: `%${search}%`,
      });
    }

    queryBuilder.orderBy('category.name', 'ASC');
  }

  private async getCount(
    queryBuilder: SelectQueryBuilder<Category>,
  ): Promise<number> {
    const [query, parameters] = queryBuilder.getQueryAndParameters();
    const [countResponse] = await this.categoryRepository.query(
      `SELECT COUNT(1) FROM (${query}) as count`,
      parameters,
    );
    return Number(countResponse.count);
  }

  private async addPaginate(
    queryBuilder: SelectQueryBuilder<Category>,
    paginationDto: PaginationDto,
  ): Promise<Category[]> {
    const { limit = 10, page = 1 } = paginationDto;
    const offset = (page - 1) * limit;

    return await queryBuilder.limit(Number(limit)).offset(offset).getMany();
  }

  private buildMeta(totalItems: number, paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      page,
      limit,
      total: totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}
