import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { EventCategory } from 'src/entities';
import { UserRoleEnum } from 'src/modules/user/enums';

import { CreateEventCategoryDto, EventCategoryResponseDto } from '../dto';
import { EventCategoryValidationService } from './event-category-validation.service';

@Injectable()
export class CreateEventCategoryService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
    private readonly validationService: EventCategoryValidationService,
  ) {}

  async execute(
    eventId: string,
    dto: CreateEventCategoryDto,
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

      await this.validationService.validateCategory(dto.categoryId);
      await this.validationService.checkExistingEventCategory(
        eventId,
        dto.categoryId,
      );

      this.validationService.validateEventCategoryDates(
        dto.startAt,
        dto.endAt,
        event.startAt,
        event.endAt,
      );
      this.validationService.validateCapacity(dto.maxRunners);

      const eventCategory = this.eventCategoryRepository.create({
        ...dto,
        event: { id: eventId },
        category: { id: dto.categoryId },
        isActive: dto.isActive ?? true,
        currentRunners: 0,
      });

      const saved = await this.eventCategoryRepository.save(eventCategory);

      const complete = await this.eventCategoryRepository.findOne({
        where: { id: saved.id },
        relations: ['category', 'event'],
      });

      return EventCategoryResponseDto.fromEntity(complete);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao adicionar categoria ao evento',
      );
    }
  }
}
