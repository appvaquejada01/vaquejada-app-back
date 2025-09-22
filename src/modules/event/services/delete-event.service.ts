import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entities';
import { UpdateQueryResponse } from 'src/shared/types/typeorm';
import { Repository } from 'typeorm';

export class DeleteEventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async delete(id: string, userId: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    await this.softDeleteEvent(id, userId);
  }

  private async softDeleteEvent(id: string, userId: string): Promise<Event> {
    const [[updateResult]]: UpdateQueryResponse<Event> =
      await this.eventRepository.query(
        `
          UPDATE 
            event
          SET 
            "isActive" = $1,
            "deletedAt" = NOW(),
            "deletedUserId" = $2
          WHERE 
            id = $3
          RETURNING *`,
        [false, userId, id],
      );

    return updateResult;
  }
}
