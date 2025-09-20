import { Event } from 'src/entities/event.entity';

export class GetEventResponseDto {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  description: string;
  address: string;
  city: string;
  state: string;

  static fromEntity(event: Event): GetEventResponseDto {
    return {
      id: event.id,
      name: event.name,
      startAt: event.startAt,
      endAt: event.endAt,
      description: event.description,
      address: event.address,
      city: event.city,
      state: event.state,
    };
  }
}
