import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { JudgeVoteDto } from '../dto';
import { Score, Subscription } from 'src/entities';

@Injectable()
export class JudgeVoteService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  public async vote(voteDto: JudgeVoteDto, userId: string): Promise<void> {
    const { eventId, passwordId } = voteDto;

    const subscription = await this.findSubscriptionByEventAndPassword(
      eventId,
      passwordId,
    );

    await this.insertScore(voteDto, subscription.id, userId);
  }

  private async findSubscriptionByEventAndPassword(
    eventId: string,
    passwordId: string,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { eventId, passwords: { id: passwordId } },
      relations: ['passwords'],
    });

    if (!subscription) {
      throw new Error(
        'Subscription not found for the given event and password',
      );
    }

    return subscription;
  }

  private async insertScore(
    voteDto: JudgeVoteDto,
    subscriptionId: string,
    userId: string,
  ): Promise<void> {
    const score = this.scoreRepository.create({
      event: { id: voteDto.eventId },
      judge: { id: voteDto.judgeId },
      passwordId: voteDto.passwordId,
      subscriptionId,
      vote: voteDto.vote,
      comments: voteDto.comments,
      createdAt: new Date(),
      createdUserId: userId,
      createdFunctionName: 'JudgeVoteService.insertScore',
    });

    const points = score.calculatePoints(voteDto.vote);
    score.points = points;

    await this.scoreRepository.insert(score);
  }
}
