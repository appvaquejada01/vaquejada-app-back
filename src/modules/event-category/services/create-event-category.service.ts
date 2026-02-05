import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EventCategory } from 'src/entities';
import { UserRoleEnum } from 'src/modules/user/enums';
import { CreatePasswordDto } from 'src/modules/password/dto';
import { InsertQueryResponse } from 'src/shared/types/typeorm';
import { CreatePasswordService } from 'src/modules/password/services';

import { CreateEventCategoryDto, EventCategoryResponseDto } from '../dto';
import { EventCategoryValidationService } from './event-category-validation.service';

@Injectable()
export class CreateEventCategoryService {
  constructor(
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
    private readonly validationService: EventCategoryValidationService,
    private readonly createPasswordService: CreatePasswordService,
  ) {}

  async create(
    dto: CreateEventCategoryDto,
    userId: string,
    userRole: UserRoleEnum,
  ): Promise<EventCategoryResponseDto> {
    const event = await this.validationService.validateEvent(
      dto.eventId,
      userId,
      userRole,
    );
    this.validationService.validateEventStatusForModification(event);

    await this.validationService.validateCategory(dto.categoryId);
    await this.validationService.checkExistingEventCategory(
      dto.eventId,
      dto.categoryId,
    );

    this.validationService.validateEventCategoryDates(
      dto.startAt,
      dto.endAt,
      event.startAt,
      event.endAt,
    );
    this.validationService.validateCapacity(dto.maxRunners);

    const eventCategory = await this.insertEventCategory(dto, userId);

    const createdCategory = await this.eventCategoryRepository.findOne({
      where: { id: eventCategory.id },
      relations: ['category', 'event'],
    });

    await this.createPasswordsForCategory(createdCategory!, dto, userId);

    return EventCategoryResponseDto.fromEntity(createdCategory!);
  }

  private async insertEventCategory(
    dto: CreateEventCategoryDto,
    userId: string,
  ): Promise<EventCategory> {
    const [eventCategory]: InsertQueryResponse<EventCategory> =
      await this.eventCategoryRepository.query(
        `
      INSERT INTO
        event_categories
        ("eventId",
        "categoryId",
        price,
        "startAt",
        "endAt",
        "maxRunners",
        "passwordLimit",
        "cattleQuantity",
        prize,
        "isActive",
        "currentRunners",
        "createdAt",
        "createdUserId",
        "createdFunctionName"
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), $12, $13
      )
      RETURNING *`,
        [
          dto.eventId,
          dto.categoryId,
          dto.price,
          dto.startAt,
          dto.endAt,
          dto.maxRunners,
          dto.passwordLimit,
          dto.cattleQuantity ?? 0,
          dto.prize ?? 0,
          dto.isActive ?? true,
          0,
          userId,
          'CreateEventCategoryService.insertEventCategory',
        ],
      );

    return eventCategory;
  }

  private async createPasswordsForCategory(
    eventCategory: EventCategory,
    createEventCategoryDto: CreateEventCategoryDto,
    userId: string,
  ): Promise<void> {
    const dto: CreatePasswordDto = {
      eventId: eventCategory.event.id,
      categoryId: eventCategory.category.id,
      price: eventCategory.price,
      initialPassword: createEventCategoryDto.initialPassword,
      finalPassword: createEventCategoryDto.finalPassword,
    };

    await this.createPasswordService.create(dto, userId);
  }
}
