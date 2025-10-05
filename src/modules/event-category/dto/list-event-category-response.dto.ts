import { EventCategory } from 'src/entities/event-category.entity';
import { CategoryResponseDto } from 'src/modules/category/dto';

export class ListEventCategoryResponseDto {
  id: string;
  price: number;
  startAt: string;
  endAt: string;
  maxRunners: number;
  currentRunners: number;
  isActive: boolean;
  eventId: string;
  category: CategoryResponseDto;

  static fromEntity(entity: EventCategory): ListEventCategoryResponseDto {
    return {
      id: entity.id,
      price: entity.price,
      startAt: entity.startAt,
      endAt: entity.endAt,
      maxRunners: entity.maxRunners,
      currentRunners: entity.currentRunners,
      isActive: entity.isActive,
      eventId: entity.event?.id,
      category: CategoryResponseDto.fromEntity(entity.category),
    };
  }
}
