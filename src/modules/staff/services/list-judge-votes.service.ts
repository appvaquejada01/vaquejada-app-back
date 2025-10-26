import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Score } from 'src/entities';
import { ListJudgeVotesResponseDto } from '../dto';

@Injectable()
export class ListJudgeVotesService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  public async listVotes(
    judgeId: string,
    eventId: string,
  ): Promise<ListJudgeVotesResponseDto[]> {
    const scores = await this.scoreRepository.find({
      where: { judgeId, event: { id: eventId } },
      relations: ['subscription', 'subscription.passwords', 'event'],
    });

    return scores.map(ListJudgeVotesResponseDto.fromEntity);
  }
}
