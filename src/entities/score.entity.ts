import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';
import { Subscription } from './subscription.entity';
import { AuditableAttributesWithTimeZone } from 'src/shared/entities';

export enum JudgeVote {
  VALID = 'valeu_o_boi',
  NULL = 'nulo',
  TV = 'tv',
  DID_NOT_RUN = 'boi_nao_quis_correr',
}

@Entity('scores')
export class Score extends AuditableAttributesWithTimeZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Subscription, (subscription) => subscription.scores)
  subscription: Subscription;

  @Column()
  subscriptionId: string;

  @Column()
  passwordId: string;

  @ManyToOne(() => User)
  judge: User;

  @Column()
  judgeId: string;

  @Column({ type: 'varchar' })
  vote: JudgeVote;

  @Column({ type: 'int', nullable: true })
  points: number;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @ManyToOne(() => Event, (event) => event.scores)
  event: Event;

  calculatePoints(vote: JudgeVote): number {
    const pointsMap = {
      [JudgeVote.VALID]: 10,
      [JudgeVote.NULL]: 0,
      [JudgeVote.TV]: 0,
      [JudgeVote.DID_NOT_RUN]: 0,
    };
    const points = pointsMap[vote];

    return points;
  }
}
