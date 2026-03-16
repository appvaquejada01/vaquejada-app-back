import { EventCategory } from 'src/entities';
import { CategoryResponseDto } from 'src/modules/category/dto';

export class EventCategoryResponseDto {
  id: string;
  price: number;
  startAt: string;
  endAt: string;
  maxRunners: number;
  currentRunners: number;
  passwordLimit: number;
  cattleQuantity: number;
  prize: number;
  isActive: boolean;
  category: CategoryResponseDto;
  isAvailable?: boolean;
  canRegister?: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: EventCategory): EventCategoryResponseDto {
    const dto = new EventCategoryResponseDto();

    dto.id = entity.id;
    dto.price = entity.price;
    dto.startAt = entity.startAt;
    dto.endAt = entity.endAt;
    dto.maxRunners = entity.maxRunners;
    dto.currentRunners = entity.currentRunners;
    dto.cattleQuantity = entity.cattleQuantity;
    dto.prize = entity.prize;
    dto.isActive = entity.isActive;
    dto.category = CategoryResponseDto.fromEntity(entity.category);
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.isAvailable = entity.isAvailable();
    dto.canRegister = entity.canRegister();

    return dto;
  }
}
