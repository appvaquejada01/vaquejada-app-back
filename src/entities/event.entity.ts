import {
  Column,
  Entity,
  ManyToOne,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { EventStatusEnum } from '../modules/event/enums';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'date' })
  startAt: string;

  @Column({ type: 'date' })
  endAt: string;

  @Column({ type: 'date' })
  purchaseClosedAt: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  inscriptionPrice: number;

  @Column({ type: 'int', nullable: false })
  inscriptionLimit: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: EventStatusEnum;

  @Column({ type: 'json', nullable: true })
  location: {
    address?: string;
    city?: string;
    state?: string;
  };

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  bannerUrl: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

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
}
