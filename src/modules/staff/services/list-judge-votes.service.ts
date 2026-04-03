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
        const score = await this.scoreRepository.findOne({
          where: { passwordId: password.id, judgeId },
          relations: ['judge'],
        });

        const votes: JudgeVoteDetailResponse[] = score
          ? [
              {
                judgeId: score.judge.id,
                judgeName: score.judge.name,
                vote: score.vote,
                points: score.points,
                comments: score.comments ?? undefined,
                votedAt: score.createdAt,
              },
            ]
          : [];

        const validPoints =
          score?.vote === JudgeVoteEnum.VALID ? (score.points ?? 0) : 0;

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

        if (score) {
          if (score.vote === JudgeVoteEnum.VALID) runnerData.validVotes++;
          else if (score.vote === JudgeVoteEnum.NULL) runnerData.nullVotes++;
          else if (score.vote === JudgeVoteEnum.TV) runnerData.tvVotes++;
          else if (score.vote === JudgeVoteEnum.DID_NOT_RUN)
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
    const vote = votes[0].vote;
    if (vote === JudgeVoteEnum.DID_NOT_RUN) return 'Não correu';
    if (vote === JudgeVoteEnum.TV) return 'TV';
    if (vote === JudgeVoteEnum.NULL) return 'Nula';
    return 'Válida';
  }
}
