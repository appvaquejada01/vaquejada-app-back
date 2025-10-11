import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Event } from 'src/entities';
import { PaginatedResponseDto } from 'src/shared/dto';

import { ListEventResponseDto, QueryListEventDto } from '../dto';

@Injectable()
export class ListEventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async list(
    query: QueryListEventDto,
  ): Promise<PaginatedResponseDto<ListEventResponseDto>> {
    const queryBuilder = this.createQueryBuilder(query);

    const totalEvents = await this.getCount(queryBuilder);

    const listEvents = await this.addPaginate(queryBuilder, query);

    const eventsDto = listEvents.map((event) =>
      ListEventResponseDto.fromEntity(event),
    );

    const meta = this.buildMeta(totalEvents, query);

    return { data: eventsDto, meta };
  }

  private createQueryBuilder(
    query: QueryListEventDto,
  ): SelectQueryBuilder<Event> {
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .select([
        'event.id',
        'event.name',
        'event.startAt',
        'event.endAt',
        'event.prize',
        'event.status',
        'event.address',
        'event.city',
        'event.state',
        'event.isActive',
        'event.isPublic',
        'event.description',
        'event.organizerId',
        'event.purchaseClosedAt',
        'event.createdAt',
        'event.bannerUrl',
      ])
      .orderBy('event.createdAt', 'DESC');

    this.mapFilters(queryBuilder, query);

    return queryBuilder;
  }

  private mapFilters(
    qb: SelectQueryBuilder<Event>,
    query: QueryListEventDto,
  ): SelectQueryBuilder<Event> {
    const {
      name,
      city,
      state,
      startDate,
      endDate,
      status,
      isActive,
      isPublic,
    } = query;

    if (name) {
      qb.andWhere('event.name ILIKE :name', { name: `%${name}%` });
    }

    if (city) {
      qb.andWhere('event.city ILIKE :city', { city: `%${city}%` });
    }

    if (state) {
      qb.andWhere('event.state ILIKE :state', { state: `%${state}%` });
    }

    if (startDate) {
      qb.andWhere('event.startAt >= :startDate', { startDate });
    }

    if (endDate) {
      qb.andWhere('event.endAt <= :endDate', { endDate });
    }

    if (status) {
      qb.andWhere('event.status = :status', { status });
    }

    if (isActive !== undefined) {
      qb.andWhere('event.isActive = :isActive', { isActive });
    }

    if (isPublic !== undefined) {
      qb.andWhere('event.isPublic = :isPublic', { isPublic });
    }

    qb.orderBy('event.startAt', 'ASC');

    return qb;
  }

  private async getCount(
    queryBuilder: SelectQueryBuilder<Event>,
  ): Promise<number> {
    const [query, parameters] = queryBuilder.getQueryAndParameters();
    const [countResponse] = await this.eventRepository.query(
      `SELECT COUNT(1) FROM (${query}) as count`,
      parameters,
    );

    return Number(countResponse.count);
  }

  private async addPaginate(
    queryBuilder: SelectQueryBuilder<Event>,
    paginationDto: QueryListEventDto,
  ): Promise<Event[]> {
    const { limit = 10, page = 1 } = paginationDto;
    const offset = (page - 1) * limit;

    return await queryBuilder.limit(Number(limit)).offset(offset).getMany();
  }

  private buildMeta(totalItems: number, paginationDto: QueryListEventDto) {
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
