import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Score } from 'src/entities';
import { JudgeVoteDto } from '../dto';

@Injectable()
export class UpdateJudgeVoteService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  public async update(
    scoreId: string,
    partialVote: Partial<JudgeVoteDto>,
  ): Promise<void> {
    const scoreExists = await this.findScoreById(scoreId);

    await this.updateVote(scoreExists, partialVote);
  }

  private async findScoreById(scoreId: string): Promise<Score> {
    const score = await this.scoreRepository.findOne({
      where: { id: scoreId },
    });

    if (!score) {
      throw new NotFoundException('Score not found');
    }

    return score;
  }

  private async updateVote(
    score: Score,
    partialVote: Partial<JudgeVoteDto>,
  ): Promise<void> {
    const newPoints = score.calculatePoints(partialVote.vote!);

    await this.scoreRepository.update(score.id, {
      points: newPoints,
      vote: partialVote.vote ?? score.vote,
    });
  }
}
