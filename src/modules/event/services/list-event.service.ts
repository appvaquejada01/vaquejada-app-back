import { DataSource } from 'typeorm';
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
    const qb = this.dataSource.createQueryBuilder(Event, 'event');

    if (query.name) {
      qb.andWhere('event.name ILIKE :name', { name: `%${query.name}%` });
    }

    if (query.date) {
      qb.andWhere('event.startAt::date = :date', { date: query.date });
    }

    const events = await qb.getMany();

    return events.map(ListEventResponseDto.fromEntity);
  }
}
