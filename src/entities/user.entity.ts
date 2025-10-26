import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Event } from './event.entity';
import { UserNatureEnum, UserRoleEnum } from '../modules/user/enums';
import { AuditableAttributesWithTimeZone } from '../shared/entities/auditable.entity';
import { Subscription } from './subscription.entity';
import { Score } from './score.entity';

@Entity('users')
export class User extends AuditableAttributesWithTimeZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  nature: UserNatureEnum;

  @Column({ type: 'varchar', nullable: false, unique: true, length: 100 })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  phone: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  cpf: string;

  @Column({ type: 'varchar', default: UserRoleEnum.USER, nullable: false })
  role: UserRoleEnum;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar', nullable: true, length: 2 })
  state: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => Event, (event) => event.organizer)
  organizedEvents: Event[];

  @OneToMany(() => Score, (score) => score.judge)
  scoresGiven: Score[];

  @ManyToMany(() => Event, (event) => event.runners)
  @JoinTable({
    name: 'event_runners',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  eventsAsRunner: Event[];

  @ManyToMany(() => Event, (event) => event.judges)
  @JoinTable({
    name: 'event_judges',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  eventsAsJudge: Event[];

  @ManyToMany(() => Event, (event) => event.speakers)
  @JoinTable({
    name: 'event_speakers',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  eventsAsSpeaker: Event[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];
}
