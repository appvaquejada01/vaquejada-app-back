import {
  Column,
  Entity,
  ManyToOne,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EventStatusEnum } from '../modules/event/enums';
import { AuditableAttributesWithTimeZone } from 'src/shared/entities';

import { User } from './user.entity';
import { Category } from './category.entity';

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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  inscriptionPrice: number;

  @Column({ type: 'int', nullable: false })
  inscriptionLimit: number;

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

  @ManyToOne(() => User, (user) => user.events)
  organizer: User;

  @ManyToMany(() => User, (user) => user.events)
  @JoinTable()
  runners: User[];

  @ManyToMany(() => User, (user) => user.events)
  @JoinTable()
  judges: User[];

  @ManyToMany(() => User, (user) => user.events)
  @JoinTable()
  speakers: User[];

  @ManyToMany(() => Category, (category) => category.events)
  @JoinTable()
  categories: Category[];
}
