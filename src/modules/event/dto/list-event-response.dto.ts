import { Event } from 'src/entities';
import { EventStatusEnum } from '../enums';

export class ListEventResponseDto {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  status: EventStatusEnum;
  description: string;
  address: string;
  city: string;
  prize: string;
  state: string;
  purchaseClosedAt: string;
  bannerUrl: string;

  static fromEntity(event: Event): ListEventResponseDto {
    return {
      id: event.id,
      name: event.name,
      startAt: event.startAt,
      endAt: event.endAt,
      address: event.address,
      description: event.description,
      city: event.city,
      prize: event.prize,
      state: event.state,
      purchaseClosedAt: event.purchaseClosedAt,
      status: event.status,
      bannerUrl: event.bannerUrl,
    };
  }
}
