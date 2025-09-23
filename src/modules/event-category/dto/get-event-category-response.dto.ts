import { EventCategory } from 'src/entities/event-category.entity';

export class GetEventCategoryResponseDto {
  id: string;
  price: number;
  startAt: string;
  endAt: string;
  maxRunners: number;
  currentRunners: number;
  isActive: boolean;
  eventId: string;
  categoryId: string;

  static fromEntity(entity: EventCategory): GetEventCategoryResponseDto {
    return {
      id: entity.id,
      price: entity.price,
      startAt: entity.startAt,
      endAt: entity.endAt,
      maxRunners: entity.maxRunners,
      currentRunners: entity.currentRunners,
      isActive: entity.isActive,
      eventId: entity.event?.id,
      categoryId: entity.category?.id,
    };
  }
}
