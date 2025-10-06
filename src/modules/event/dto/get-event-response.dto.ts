import { Event } from 'src/entities';

export class GetEventResponseDto {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  description: string;
  address: string;
  city: string;
  prize: string;
  state: string;
  purchaseClosedAt: string;

  static fromEntity(event: Event): GetEventResponseDto {
    return {
      id: event.id,
      name: event.name,
      startAt: event.startAt,
      endAt: event.endAt,
      description: event.description,
      address: event.address,
      city: event.city,
      prize: event.prize,
      state: event.state,
      purchaseClosedAt: event.purchaseClosedAt,
    };
  }
}
