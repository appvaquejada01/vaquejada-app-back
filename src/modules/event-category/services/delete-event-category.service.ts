import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { EventCategory } from 'src/entities';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { RemovePasswordsService } from 'src/modules/password/services';

import { EventCategoryValidationService } from './event-category-validation.service';

@Injectable()
export class DeleteEventCategoryService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
    private readonly validationService: EventCategoryValidationService,
    private readonly removePasswordsService: RemovePasswordsService,
  ) {}

  async execute(
    eventId: string,
    eventCategoryId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    try {
      const event = await this.validationService.validateEvent(
        eventId,
        user.userId,
        user.role,
      );
      this.validationService.validateEventStatusForModification(event);

      const eventCategory = await this.eventCategoryRepository.findOne({
        where: { id: eventCategoryId, event: { id: eventId } },
      });

      if (!eventCategory) {
        throw new NotFoundException('Categoria de evento não encontrada');
      }

      await this.eventCategoryRepository.remove(eventCategory);
      await this.removePasswordsService.remove(eventId, eventCategoryId);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao remover categoria do evento',
      );
    }
  }
}
