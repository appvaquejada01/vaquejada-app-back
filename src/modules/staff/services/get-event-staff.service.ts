import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event } from 'src/entities';
import { NotFoundException } from '@nestjs/common';
import { GetEventStaffDto } from '../dto/get-event-staff.dto';

export class GetEventStaffService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  public async findById(eventId: string): Promise<GetEventStaffDto> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['speakers', 'judges'],
      select: ['id', 'name', 'speakers', 'judges'],
    });

    if (!event) {
      throw new NotFoundException(`Evento não encontrado`);
    }

    return GetEventStaffDto.fromEntity(event);
  }
}
