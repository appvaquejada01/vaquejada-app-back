import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { Event } from 'src/entities';
import { UpdateQueryResponse } from 'src/shared/types/typeorm';
import { EventStatusEnum } from '../enums';

export class UpdateEventStatusService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async updateStatus(
    id: string,
    status: EventStatusEnum,
    userId: string,
  ): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    await this.updateEventStatus(id, status, userId);
  }

  private async updateEventStatus(
    id: string,
    status: EventStatusEnum,
    userId: string,
  ): Promise<Event> {
    const [[updateResult]]: UpdateQueryResponse<Event> =
      await this.eventRepository.query(
        `
      UPDATE 
        event
      SET 
        status = $1, 
        "updatedAt" = NOW(),
        "updatedUserId" = $2
      WHERE 
        id = $2
      RETURNING *`,
        [status, id, userId],
      );

    return updateResult;
  }
}
