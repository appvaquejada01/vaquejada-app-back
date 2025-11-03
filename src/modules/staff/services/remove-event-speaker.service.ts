import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event, User } from 'src/entities';
import { NotFoundException } from '@nestjs/common';

export class RemoveEventSpeakerService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async remove(
    eventId: string,
    speakerId: string,
    userId: string,
  ): Promise<void> {
    try {
      const [event, speaker] = await Promise.all([
        this.validateEventExistence(eventId),
        this.validateSpeakerExistence(speakerId),
      ]);

      await this.validateSpeakerInEvent(event, speakerId);
      await this.removeSpeakerFromEvent(event, speaker, userId);
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

  private async validateSpeakerInEvent(event: Event, speakerId: string) {
    const isSpeakerInEvent = event.speakers.some(
      (speaker) => speaker.id === speakerId,
    );

    if (!isSpeakerInEvent) {
      throw new NotFoundException(`Locutor não está associado ao evento`);
    }
  }

  private async removeSpeakerFromEvent(
    event: Event,
    speaker: User,
    userId: string,
  ): Promise<void> {
    await this.eventRepository.query(
      `DELETE FROM "event_speakers" WHERE "event_id" = $1 AND "user_id" = $2`,
      [event.id, speaker.id],
    );
  }
}
