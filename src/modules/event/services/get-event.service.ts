import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Event } from 'src/entities/event.entity';
import { ConnectionTypeEnum } from 'src/utils/database';

import { GetEventResponseDto } from '../dto';

@Injectable()
export class GetEventService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
  ) {}

  async getById(id: string): Promise<GetEventResponseDto> {
    const event = await this.dataSource
      .getRepository(Event)
      .findOne({ where: { id } });

    if (!event) throw new NotFoundException('Evento não encontrado');

    return GetEventResponseDto.fromEntity(event);
  }
}
