import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Event } from 'src/entities';
import { ListJudgeEventsResponseDto } from '../dto';

@Injectable()
export class ListJudgeEventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  public async findByJudgeId(
    judgeId: string,
  ): Promise<ListJudgeEventsResponseDto> {
    try {
      const events = await this.eventRepository
        .createQueryBuilder('event')
        .innerJoinAndSelect('event.judges', 'judge')
        .leftJoinAndSelect('event.runners', 'runner')
        .leftJoinAndSelect('runner.subscriptions', 'subscription')
        .leftJoinAndSelect('subscription.passwords', 'password')
        .where('judge.id = :judgeId', { judgeId })
        .select([
          'event.id',
          'event.name',
          'event.startAt',
          'event.endAt',
          'event.address',
          'event.status',
          'event.city',
          'event.state',
          'event.isActive',
          'event.bannerUrl',
          'event.description',
        ])
        .addSelect(['judge.id', 'judge.name'])
        .addSelect(['runner.id', 'runner.name'])
        .addSelect([
          'subscription.id',
          'subscription.createdAt',
          'subscription.status',
        ])
        .addSelect(['password.id', 'password.number', 'password.status'])
        .orderBy('event.startAt', 'DESC')
        .getMany();

      if (!events || events.length === 0) {
        return new ListJudgeEventsResponseDto();
      }

      return ListJudgeEventsResponseDto.fromEntities(events);
    } catch (error) {
      console.error('Error fetching judge events:', error);
      throw new NotFoundException('Erro ao buscar eventos do juiz');
    }
  }
}
