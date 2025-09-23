import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EventCategory } from 'src/entities';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
  ) {}

  async isAvailable(eventCategoryId: string): Promise<boolean> {
    const eventCategory = await this.eventCategoryRepository.findOne({
      where: { id: eventCategoryId },
    });
    if (!eventCategory) return false;

    const now = new Date();
    return (
      eventCategory.isActive &&
      eventCategory.currentRunners < eventCategory.maxRunners &&
      new Date(eventCategory.startAt) <= now &&
      new Date(eventCategory.endAt) >= now
    );
  }
}
