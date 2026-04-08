import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event, Score, JudgeVoteEnum } from 'src/entities';
import { PasswordStatusEnum } from 'src/modules/password/enums';

import {
  SpeakerVoteSummaryResponse,
  RunnerVoteSummaryResponse,
  PasswordVoteSummaryResponse,
  JudgeVoteDetailResponse,
} from '../dto';

@Injectable()
export class ListJudgeVotesService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  public async listVotes(
    judgeId: string,
    eventId: string,
  ): Promise<SpeakerVoteSummaryResponse> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: [
        'subscriptions',
        'subscriptions.user',
        'subscriptions.passwords',
        'subscriptions.passwords.category',
      ],
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    event.subscriptions = event.subscriptions.filter((sub) =>
      sub.passwords.some((p) => p.status === PasswordStatusEnum.RESERVED),
    );

    const runners: RunnerVoteSummaryResponse[] = [];

    for (const subscription of event.subscriptions) {
      const { user, passwords } = subscription;

      const runnerData: RunnerVoteSummaryResponse = {
        userId: user.id,
        runnerName: user.name,
        runnerCity: user.city ?? '',
        runnerState: user.state ?? '',
        passwords: [],
        totalPoints: 0,
        validVotes: 0,
        nullVotes: 0,
        tvVotes: 0,
        didNotRunVotes: 0,
      };

      for (const password of passwords) {
        const scores = await this.scoreRepository.find({
          where: { passwordId: password.id, judgeId },
          relations: ['judge'],
          order: { createdAt: 'ASC' },
        });

        const votes: JudgeVoteDetailResponse[] = scores.map((score) => ({
          scoreId: score.id,
          judgeId: score.judge.id,
          judgeName: score.judge.name,
          vote: score.vote,
          points: score.points,
          comments: score.comments ?? undefined,
          votedAt: score.createdAt,
        }));

        const validPoints = scores.reduce(
          (sum, s) =>
            s.vote === JudgeVoteEnum.VALID ? sum + (s.points ?? 0) : sum,
          0,
        );

        const lastScore = scores.length > 0 ? scores[scores.length - 1] : null;

        const passwordData: PasswordVoteSummaryResponse = {
          passwordId: password.id,
          passwordNumber: password.number,
          passwordPrice: password.price ?? 0,
          categoryName: password.category.name,
          votes,
          passwordPoints: validPoints,
          passwordStatus: this.getPasswordStatus(votes),
        };

        runnerData.passwords.push(passwordData);
        runnerData.totalPoints += validPoints;

        if (lastScore) {
          if (lastScore.vote === JudgeVoteEnum.VALID) runnerData.validVotes++;
          else if (lastScore.vote === JudgeVoteEnum.NULL)
            runnerData.nullVotes++;
          else if (lastScore.vote === JudgeVoteEnum.TV) runnerData.tvVotes++;
          else if (lastScore.vote === JudgeVoteEnum.DID_NOT_RUN)
            runnerData.didNotRunVotes++;
        }
      }

      runners.push(runnerData);
    }

    return {
      eventId: event.id,
      eventName: event.name,
      eventDate: event.startAt,
      runners,
    };
  }

  private getPasswordStatus(votes: JudgeVoteDetailResponse[]): string {
    if (votes.length === 0) return 'Sem votos';
    const lastVote = votes[votes.length - 1].vote;
    if (lastVote === JudgeVoteEnum.DID_NOT_RUN) return 'Aguardando novo boi';
    if (lastVote === JudgeVoteEnum.TV) return 'TV';
    if (lastVote === JudgeVoteEnum.NULL) return 'Nula';
    return 'Válida';
  }
}
