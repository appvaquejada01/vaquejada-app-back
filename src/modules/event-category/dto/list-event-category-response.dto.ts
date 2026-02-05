import { EventCategory } from 'src/entities/event-category.entity';
import { CategoryResponseDto } from 'src/modules/category/dto';

export class ListEventCategoryResponseDto {
  id: string;
  price: number;
  startAt: string;
  endAt: string;
  maxRunners: number;
  currentRunners: number;
  passwordLimit: number;
  cattleQuantity: number;
  prize: number;
  initialPassword?: number;
  finalPassword?: number;
  isActive: boolean;
  eventId: string;
  category: CategoryResponseDto;

  static fromEntity(entity: EventCategory): ListEventCategoryResponseDto {
    const passwordNumbers = Array.isArray(entity.category?.passwords)
      ? entity.category.passwords.map((p) => Number(p.number))
      : [];
    const initialPassword =
      passwordNumbers.length > 0 ? Math.min(...passwordNumbers) : undefined;
    const finalPassword =
      passwordNumbers.length > 0 ? Math.max(...passwordNumbers) : undefined;

    return {
      id: entity.id,
      price: entity.price,
      startAt: entity.startAt,
      endAt: entity.endAt,
      maxRunners: entity.maxRunners,
      currentRunners: entity.currentRunners,
      passwordLimit: entity.passwordLimit,
      cattleQuantity: entity.cattleQuantity,
      prize: entity.prize,
      initialPassword: initialPassword,
      finalPassword: finalPassword,
      isActive: entity.isActive,
      eventId: entity.event?.id,
      category: CategoryResponseDto.fromEntity(entity.category),
    };
  }
}
