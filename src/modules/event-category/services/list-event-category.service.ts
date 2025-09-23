import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EventCategory } from 'src/entities';
import { EventCategoryResponseDto } from '../dto';

@Injectable()
export class ListEventCategoriesService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
  ) {}

  async execute(eventId: string): Promise<EventCategoryResponseDto[]> {
    const eventCategories = await this.eventCategoryRepository.find({
      where: { event: { id: eventId } },
      relations: ['category', 'event'],
    });

    return eventCategories.map(EventCategoryResponseDto.fromEntity);
  }
}
