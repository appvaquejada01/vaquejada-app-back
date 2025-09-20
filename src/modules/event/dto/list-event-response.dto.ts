import { Event } from 'src/entities/event.entity';

export class ListEventResponseDto {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  address: string;
  city: string;
  state: string;

  static fromEntity(event: Event): ListEventResponseDto {
    return {
      id: event.id,
      name: event.name,
      startAt: event.startAt,
      endAt: event.endAt,
      address: event.address,
      city: event.city,
      state: event.state,
    };
  }
}
