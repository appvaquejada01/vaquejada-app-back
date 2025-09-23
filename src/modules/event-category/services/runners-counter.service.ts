import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';

import { EventCategory } from 'src/entities';

@Injectable()
export class RunnersCounterService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
  ) {}

  async increment(eventCategoryId: string): Promise<void> {
    const eventCategory = await this.eventCategoryRepository.findOne({
      where: { id: eventCategoryId },
    });
    if (!eventCategory)
      throw new BadRequestException('Categoria de evento não encontrada');

    if (eventCategory.currentRunners >= eventCategory.maxRunners) {
      throw new BadRequestException('Capacidade máxima atingida');
    }

    eventCategory.currentRunners += 1;
    await this.eventCategoryRepository.save(eventCategory);
  }

  async decrement(eventCategoryId: string): Promise<void> {
    const eventCategory = await this.eventCategoryRepository.findOne({
      where: { id: eventCategoryId },
    });
    if (!eventCategory)
      throw new BadRequestException('Categoria de evento não encontrada');

    if (eventCategory.currentRunners <= 0) {
      throw new BadRequestException('Nenhum participante para remover');
    }

    eventCategory.currentRunners -= 1;
    await this.eventCategoryRepository.save(eventCategory);
  }
}
