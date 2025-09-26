import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { EventCategory } from 'src/entities';
import { PaginatedResponseDto, PaginationDto } from 'src/shared/dto';

import { ListEventCategoryResponseDto } from '../dto';

@Injectable()
export class ListEventCategoriesService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
  ) {}

  async findAll(
    eventId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<ListEventCategoryResponseDto>> {
    const queryBuilder = await this.createQueryBuilder(eventId);

    const totalCategories = await this.getCount(queryBuilder);

    const listEventCategories = await this.addPaginate(
      queryBuilder,
      paginationDto,
    );

    const eventCategories = listEventCategories.map(
      ListEventCategoryResponseDto.fromEntity,
    );

    const meta = this.buildMeta(totalCategories, paginationDto);

    return { data: eventCategories, meta };
  }

  private async createQueryBuilder(
    eventId: string,
  ): Promise<SelectQueryBuilder<EventCategory>> {
    const queryBuilder = this.eventCategoryRepository
      .createQueryBuilder('eventCategory')
      .leftJoinAndSelect('eventCategory.category', 'category')
      .leftJoinAndSelect('eventCategory.event', 'event')
      .where('event.id = :eventId', { eventId });

    return queryBuilder;
  }

  private async getCount(
    queryBuilder: SelectQueryBuilder<EventCategory>,
  ): Promise<number> {
    const [query, parameters] = queryBuilder.getQueryAndParameters();
    const [countResponse] = await this.eventCategoryRepository.query(
      `SELECT COUNT(1) FROM (${query}) as count`,
      parameters,
    );

    return Number(countResponse.count);
  }

  private async addPaginate(
    queryBuilder: SelectQueryBuilder<EventCategory>,
    paginationDto: PaginationDto,
  ): Promise<EventCategory[]> {
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
