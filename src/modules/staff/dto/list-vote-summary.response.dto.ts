export interface SpeakerVoteSummaryResponse {
  eventId: string;
  eventName: string;
  eventDate: string;
  runners: RunnerVoteSummaryResponse[];
}

export interface RunnerVoteSummaryResponse {
  userId: string;
  runnerName: string;
  runnerCity: string;
  runnerState: string;
  passwords: PasswordVoteSummaryResponse[];
  totalPoints: number;
  validVotes: number;
  nullVotes: number;
  tvVotes: number;
  didNotRunVotes: number;
}

export interface PasswordVoteSummaryResponse {
  passwordId: string;
  passwordNumber: string;
  passwordPrice: number;
  categoryName: string;
  votes: JudgeVoteDetailResponse[];
  passwordPoints: number;
  passwordStatus: string;
}

export interface JudgeVoteDetailResponse {
  judgeId: string;
  judgeName: string;
  vote: string;
  points: number;
  comments?: string;
  votedAt: Date;
}
