import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Event } from 'src/entities';

import { EventResponseDto } from '../dto/event-response.dto';

@Injectable()
export class GetEventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async findOne(id: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'runners', 'judges', 'speakers'],
    });

    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    return EventResponseDto.fromEntity(event);
  }
}
