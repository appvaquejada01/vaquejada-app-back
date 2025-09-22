import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EventStatusEnum } from '../modules/event/enums';
import { AuditableAttributesWithTimeZone } from '../shared/entities/auditable.entity';

import { Run } from './run.entity';
import { User } from './user.entity';
import { RunPurchase } from './run-purchase.entity';
import { RunCategory } from './run-category.entity';
import { EventCategory } from './event-category.entity';

@Entity('events')
export class Event extends AuditableAttributesWithTimeZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'timestamptz' })
  startAt: string;

  @Column({ type: 'timestamptz' })
  endAt: string;

  @Column({ type: 'timestamptz' })
  purchaseClosedAt: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: EventStatusEnum;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  bannerUrl: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean; // ADD: Se o evento é público para visualização

  // RELAÇÃO COM ORGANIZADOR
  @ManyToOne(() => User, (user) => user.organizedEvents)
  organizer: User;

  @Column() // ADD: organizerId deve ser uma coluna separada
  organizerId: string;

  // RELAÇÕES N:N EXISTENTES (ajustar os nomes)
  @ManyToMany(() => User, (user) => user.eventsAsRunner)
  @JoinTable({
    name: 'event_runners',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  runners: User[];

  @ManyToMany(() => User, (user) => user.eventsAsJudge)
  @JoinTable({
    name: 'event_judges',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  judges: User[];

  @ManyToMany(() => User, (user) => user.eventsAsSpeaker)
  @JoinTable({
    name: 'event_speakers',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  speakers: User[];

  @OneToMany(() => RunPurchase, (runPurchase) => runPurchase.event)
  runPurchases: RunPurchase[];

  @OneToMany(() => Run, (run) => run.event)
  runs: Run[];

  @OneToMany(() => RunCategory, (runCategory) => runCategory.event)
  runCategories: RunCategory[];

  @OneToMany(() => EventCategory, (eventCategory) => eventCategory.event)
  eventCategories: EventCategory[];

  // @OneToMany(() => Score, (score) => score.event)
  // scores: Score[];

  canPurchaseRuns(): boolean {
    return (
      new Date() < new Date(this.purchaseClosedAt) &&
      this.status === EventStatusEnum.SCHEDULED
    );
  }

  isLive(): boolean {
    return this.status === EventStatusEnum.LIVE;
  }
}
