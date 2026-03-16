import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event, User } from 'src/entities';

@Injectable()
export class CreateEventJudgeService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(
    eventId: string,
    judgeId: string,
    userId: string,
  ): Promise<void> {
    try {
      const [event, judge] = await Promise.all([
        this.validateEventExistence(eventId),
        this.validateJudgeExistence(judgeId),
      ]);

      await this.validateJudgeNotInEvent(event, judgeId);
      await this.addJudgeToEvent(event, judge, userId);
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
      throw new NotFoundException(`Juiz não encontrado`);
    }

    return judge;
  }

  private async validateJudgeNotInEvent(
    event: Event,
    judgeId: string,
  ): Promise<void> {
    const judgeExistsInEvent = event.judges?.some(
      (judge) => judge.id === judgeId,
    );

    if (judgeExistsInEvent) {
      throw new ConflictException(`Juiz já está associado a este evento`);
    }
  }

  private async addJudgeToEvent(
    event: Event,
    judge: User,
    userId: string,
  ): Promise<void> {
    await this.eventRepository.query(
      `INSERT INTO "event_judges"("event_id", "user_id") VALUES ($1, $2)`,
      [event.id, judge.id],
    );

    await this.eventRepository.query(
      `
      UPDATE 
        events
      SET 
        "updatedAt" = NOW(),
        "updatedUserId" = $1,
        "updatedFunctionName" = 'CreateEventJudgeService.addJudgeToEvent'
      WHERE 
        id = $2`,
      [userId, event.id],
    );
  }
}
