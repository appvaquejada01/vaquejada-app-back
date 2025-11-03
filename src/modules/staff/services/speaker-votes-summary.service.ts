import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event, JudgeVoteEnum, Score } from 'src/entities';
import { Repository } from 'typeorm';
import {
  JudgeVoteDetailResponse,
  PasswordVoteSummaryResponse,
  RunnerVoteSummaryResponse,
  SpeakerVoteSummaryResponse,
} from '../dto';

@Injectable()
export class SpeakerVotesSummaryService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  async getEventVotesSummary(
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
          where: { passwordId: password.id },
          relations: ['judge'],
        });

        const votes: JudgeVoteDetailResponse[] = scores.map((s) => ({
          judgeId: s.judge.id,
          judgeName: s.judge.name,
          vote: s.vote,
          points: s.points,
          comments: s.comments ?? undefined,
          votedAt: s.createdAt,
        }));

        const validPoints = votes
          .filter((v) => v.vote === JudgeVoteEnum.VALID)
          .reduce((sum, v) => sum + (v.points ?? 0), 0);

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

        // Acumula totais do corredor
        runnerData.totalPoints += validPoints;
        runnerData.validVotes += votes.filter(
          (v) => v.vote === JudgeVoteEnum.VALID,
        ).length;
        runnerData.nullVotes += votes.filter(
          (v) => v.vote === JudgeVoteEnum.NULL,
        ).length;
        runnerData.tvVotes += votes.filter(
          (v) => v.vote === JudgeVoteEnum.TV,
        ).length;
        runnerData.didNotRunVotes += votes.filter(
          (v) => v.vote === JudgeVoteEnum.DID_NOT_RUN,
        ).length;
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
    const totalVotes = votes.length;
    if (totalVotes === 0) return 'Sem votos';

    const didNotRun = votes.every((v) => v.vote === JudgeVoteEnum.DID_NOT_RUN);
    if (didNotRun) return 'Não correu';

    const tvVotes = votes.filter((v) => v.vote === JudgeVoteEnum.TV).length;
    if (tvVotes === totalVotes) return 'TV';

    const nullVotes = votes.filter((v) => v.vote === JudgeVoteEnum.NULL).length;
    if (nullVotes > totalVotes / 2) return 'Nula';

    return 'Válida';
  }
}
