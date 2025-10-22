import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event, User } from 'src/entities';

@Injectable()
export class CreateEventSpeakerService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(
    eventId: string,
    speakerId: string,
    userId: string,
  ): Promise<void> {
    try {
      const [event, speaker] = await Promise.all([
        this.validateEventExistence(eventId),
        this.validateSpeakerExistence(speakerId),
      ]);

      await this.validateSpeakerNotInEvent(event, speakerId);
      await this.addSpeakerToEvent(event, speaker, userId);
    } catch (error) {
      throw error;
    }
  }

  private async validateEventExistence(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['speakers'],
      select: ['id', 'name', 'speakers'],
    });

    if (!event) {
      throw new NotFoundException(`Evento não encontrado`);
    }

    return event;
  }

  private async validateSpeakerExistence(speakerId: string): Promise<User> {
    const speaker = await this.userRepository.findOne({
      where: { id: speakerId },
      select: ['id', 'name'],
    });

    if (!speaker) {
      throw new NotFoundException(`Locutor não encontrado`);
    }

    return speaker;
  }

  private async validateSpeakerNotInEvent(
    event: Event,
    speakerId: string,
  ): Promise<void> {
    const speakerExistsInEvent = event.speakers?.some(
      (speaker) => speaker.id === speakerId,
    );

    if (speakerExistsInEvent) {
      throw new ConflictException(`Locutor já está associado a este evento`);
    }
  }

  private async addSpeakerToEvent(
    event: Event,
    speaker: User,
    userId: string,
  ): Promise<void> {
    await this.eventRepository.query(
      `INSERT INTO "event_speakers"("event_id", "user_id") VALUES ($1, $2)`,
      [event.id, speaker.id],
    );

    await this.eventRepository.query(
      `
      UPDATE 
        events
      SET 
        "updatedAt" = NOW(),
        "updatedUserId" = $1,
        "updatedFunctionName" = 'CreateEventSpeakerService.addSpeakerToEvent'
      WHERE 
        id = $2`,
      [userId, event.id],
    );
  }
}
