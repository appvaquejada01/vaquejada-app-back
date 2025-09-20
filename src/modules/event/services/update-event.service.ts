import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Event } from 'src/entities/event.entity';
import { ConnectionTypeEnum } from 'src/utils/database';
import { UpdateQueryResponse } from 'src/shared/types/typeorm';

import { UpdateEventDto } from '../dto';

@Injectable()
export class UpdateEventService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
  ) {}

  async update(
    eventId: string,
    dto: UpdateEventDto,
    userId: string,
  ): Promise<UpdateEventDto> {
    const event = await this.findEventById(eventId);

    const updatedEvent = await this.updateEvent(event.id, dto, userId);

    return UpdateEventDto.fromEntity(updatedEvent);
  }

  private async findEventById(eventId: string): Promise<Event> {
    const event = await this.dataSource
      .createQueryBuilder(Event, 'event')
      .where('event.id = :eventId', { eventId })
      .getOne();

    if (!event) throw new NotFoundException('Evento não encontrado');

    return event;
  }

  private async updateEvent(
    eventId: string,
    dto: UpdateEventDto,
    userId: string,
  ): Promise<Event> {
    const [[updatedEvent]]: UpdateQueryResponse<Event> =
      await this.dataSource.query(
        `
      UPDATE 
        "events" 
      SET
        name = $1,
        "startAt" = $2,
        "endAt" = $3,
        "purchaseClosedAt" = $4,
        "inscriptionPrice" = $5,
        "inscriptionLimit" = $6,
        status = $7,
        address = $8,
        city = $9,
        state = $10,
        "updateUserId" = $11,
        "updatedAt" = NOW(),
        "updatedFunctionName" = 'UpdateEventService.updateEvent'
      WHERE
        id = $12
      RETURNING *`,
        [
          dto.name,
          dto.startAt,
          dto.endAt,
          dto.purchaseClosedAt,
          dto.inscriptionPrice,
          dto.inscriptionLimit,
          dto.status,
          dto.address,
          dto.city,
          dto.state,
          userId,
          eventId,
        ],
      );

    return updatedEvent;
  }
}
