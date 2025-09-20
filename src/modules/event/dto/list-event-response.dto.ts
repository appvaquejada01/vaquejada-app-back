import { Event } from 'src/entities/event.entity';
import { EventStatusEnum } from '../enums';

export class ListEventResponseDto {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  status: EventStatusEnum;
  address: string;
  city: string;
  state: string;
  purchaseClosedAt: string;

  static fromEntity(event: Event): ListEventResponseDto {
    return {
      id: event.id,
      name: event.name,
      startAt: event.startAt,
      endAt: event.endAt,
      address: event.address,
      city: event.city,
      state: event.state,
      purchaseClosedAt: event.purchaseClosedAt,
      status: event.status,
    };
  }
}
