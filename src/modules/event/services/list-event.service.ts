import { DataSource, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Event } from 'src/entities/event.entity';
import { ConnectionTypeEnum } from 'src/utils/database';

import { ListEventResponseDto, QueryListEventDto } from '../dto';

@Injectable()
export class ListEventService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
  ) {}

  async list(query: QueryListEventDto): Promise<ListEventResponseDto[]> {
    const qb = this.createQueryBuilder();
    this.mapFilters(qb, query);

    const events = await qb.getMany();

    return events.map(ListEventResponseDto.fromEntity);
  }

  private createQueryBuilder(): SelectQueryBuilder<Event> {
    return this.dataSource
      .createQueryBuilder(Event, 'event')
      .select([
        'event.id',
        'event.name',
        'event.startAt',
        'event.endAt',
        'event.status',
        'event.address',
        'event.city',
        'event.state',
        'event.purchaseClosedAt',
      ]);
  }

  private mapFilters(
    qb: SelectQueryBuilder<Event>,
    query: QueryListEventDto,
  ): SelectQueryBuilder<Event> {
    const { name, date } = query;

    if (name) {
      qb.andWhere('event.name ILIKE :name', { name: `%${name}%` });
    }

    if (date) {
      qb.andWhere('DATE(event.date) = :date', { date: date });
    }

    return qb;
  }
}
