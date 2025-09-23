import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { EventCategory } from 'src/entities';
import { UserRoleEnum } from 'src/modules/user/enums';

import { UpdateEventCategoryDto, EventCategoryResponseDto } from '../dto';
import { EventCategoryValidationService } from './event-category-validation.service';

@Injectable()
export class UpdateEventCategoryService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
    private readonly validationService: EventCategoryValidationService,
  ) {}

  async execute(
    eventId: string,
    eventCategoryId: string,
    dto: UpdateEventCategoryDto,
    userId: string,
    userRole: UserRoleEnum,
  ): Promise<EventCategoryResponseDto> {
    try {
      const event = await this.validationService.validateEvent(
        eventId,
        userId,
        userRole,
      );
      this.validationService.validateEventStatusForModification(event);

      const eventCategory = await this.validationService.validateEventCategory(
        eventCategoryId,
        eventId,
      );

      if (dto.maxRunners) {
        this.validationService.validateCapacity(
          dto.maxRunners,
          eventCategory.currentRunners,
        );
      }

      Object.assign(eventCategory, dto);
      await this.eventCategoryRepository.save(eventCategory);

      const updated = await this.eventCategoryRepository.findOne({
        where: { id: eventCategoryId },
        relations: ['category', 'event'],
      });

      return EventCategoryResponseDto.fromEntity(updated);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar categoria do evento',
      );
    }
  }
}
