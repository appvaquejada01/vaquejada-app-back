import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { EventCategory } from 'src/entities';
import { UserRoleEnum } from 'src/modules/user/enums';

import { EventCategoryValidationService } from './event-category-validation.service';

@Injectable()
export class DeleteEventCategoryService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
    private readonly validationService: EventCategoryValidationService,
  ) {}

  async execute(
    eventId: string,
    eventCategoryId: string,
    userId: string,
    userRole: UserRoleEnum,
  ): Promise<void> {
    try {
      const event = await this.validationService.validateEvent(
        eventId,
        userId,
        userRole,
      );
      this.validationService.validateEventStatusForModification(event);

      const eventCategory = await this.eventCategoryRepository.findOne({
        where: { id: eventCategoryId, event: { id: eventId } },
      });

      if (!eventCategory) {
        throw new NotFoundException('Categoria de evento não encontrada');
      }

      await this.eventCategoryRepository.remove(eventCategory);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao remover categoria do evento',
      );
    }
  }
}
