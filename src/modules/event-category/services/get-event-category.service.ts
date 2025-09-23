import { EventCategory } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { EventCategoryResponseDto } from '../dto';

@Injectable()
export class GetEventCategoryService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
  ) {}

  async execute(
    eventId: string,
    eventCategoryId: string,
  ): Promise<EventCategoryResponseDto> {
    const eventCategory = await this.eventCategoryRepository.findOne({
      where: { id: eventCategoryId, event: { id: eventId } },
      relations: ['category', 'event'],
    });

    if (!eventCategory) {
      throw new NotFoundException('Categoria de evento não encontrada');
    }

    return EventCategoryResponseDto.fromEntity(eventCategory);
  }
}
