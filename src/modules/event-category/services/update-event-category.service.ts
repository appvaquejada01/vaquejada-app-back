import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EventCategory } from 'src/entities';
import { UserRoleEnum } from 'src/modules/user/enums';
import { UpdateQueryResponse } from 'src/shared/types/typeorm';

import { UpdateEventCategoryDto, EventCategoryResponseDto } from '../dto';
import { EventCategoryValidationService } from './event-category-validation.service';

@Injectable()
export class UpdateEventCategoryService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
    private readonly validationService: EventCategoryValidationService,
  ) {}

  async update(
    eventCategoryId: string,
    dto: UpdateEventCategoryDto,
    userId: string,
    userRole: UserRoleEnum,
  ): Promise<EventCategoryResponseDto> {
    const event = await this.validationService.validateEvent(
      dto.eventId,
      userId,
      userRole,
    );
    this.validationService.validateEventStatusForModification(event);

    const eventCategory = await this.validationService.validateEventCategory(
      eventCategoryId,
      dto.eventId,
    );

    if (dto.maxRunners) {
      this.validationService.validateCapacity(
        dto.maxRunners,
        eventCategory.currentRunners,
      );
    }

    const result = await this.updateEventCategory(eventCategoryId, dto, userId);

    const updatedEventCategory = await this.eventCategoryRepository.findOne({
      where: { id: result.id },
      relations: ['category'],
    });

    return EventCategoryResponseDto.fromEntity(updatedEventCategory!);
  }

  private async updateEventCategory(
    eventCategoryId: string,
    dto: UpdateEventCategoryDto,
    userId: string,
  ): Promise<EventCategory> {
    const [[result]]: UpdateQueryResponse<EventCategory> =
      await this.eventCategoryRepository.query(
        `
      UPDATE
        event_categories
      SET
        "categoryId" = COALESCE($1, "categoryId"),
        price = COALESCE($2, price),
        "maxRunners" = COALESCE($3, "maxRunners"),
        "currentRunners" = COALESCE($4, "currentRunners"),
        "passwordLimit" = COALESCE($5, "passwordLimit"),
        "cattleQuantity" = COALESCE($6, "cattleQuantity"),
        prize = COALESCE($7, prize),
        "startAt" = COALESCE($8, "startAt"),
        "endAt" = COALESCE($9, "endAt"),
        "isActive" = COALESCE($10, "isActive"),
        "updatedAt" = NOW(),
        "updatedUserId" = $11,
        "updatedFunctionName" = 'UpdateEventCategoryService.updateEventCategory'
      WHERE
        id = $12
      RETURNING *`,
        [
          dto.categoryId,
          dto.price,
          dto.maxRunners,
          dto.currentRunners,
          dto.passwordLimit,
          dto.cattleQuantity,
          dto.prize,
          dto.startAt,
          dto.endAt,
          dto.isActive,
          userId,
          eventCategoryId,
        ],
      );

    return result;
  }
}
