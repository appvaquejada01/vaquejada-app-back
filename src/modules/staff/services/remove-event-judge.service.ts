import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event, User } from 'src/entities';
import { NotFoundException } from '@nestjs/common';

export class RemoveEventJudgeService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async remove(
    eventId: string,
    judgeId: string,
    userId: string,
  ): Promise<void> {
    try {
      const [event, judge] = await Promise.all([
        this.validateEventExistence(eventId),
        this.validateJudgeExistence(judgeId),
      ]);

      await this.validateJudgeInEvent(event, judgeId);
      await this.removeJudgeFromEvent(event, judge, userId);
    } catch (error) {
      throw error;
    }
  }

  private async validateEventExistence(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['judges'],
      select: ['id', 'name', 'judges'],
    });

    if (!event) {
      throw new NotFoundException(`Evento não encontrado`);
    }

    return event;
  }

  private async validateJudgeExistence(judgeId: string): Promise<User> {
    const judge = await this.userRepository.findOne({
      where: { id: judgeId },
      select: ['id', 'name'],
    });

    if (!judge) {
      throw new NotFoundException(`Locutor não encontrado`);
    }

    return judge;
  }

  private async validateJudgeInEvent(event: Event, judgeId: string) {
    const isSpeakerInEvent = event.speakers.some(
      (judge) => judge.id === judgeId,
    );

    if (!isSpeakerInEvent) {
      throw new NotFoundException(`Locutor não está associado ao evento`);
    }
  }

  private async removeJudgeFromEvent(
    event: Event,
    judge: User,
    userId: string,
  ): Promise<void> {
    await this.eventRepository.query(
      `DELETE FROM "event_judges" WHERE "event_id" = $1 AND "user_id" = $2`,
      [event.id, judge.id],
    );
  }
}
