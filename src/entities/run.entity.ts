import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { RunCategory } from './run-category.entity';
import { RunPurchase } from './run-purchase.entity';

export enum RunStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  USED = 'used',
}

@Entity('runs')
export class Run {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  number: number; // Número da corrida: 0, 1, 2, ..., 500

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'varchar',
    default: RunStatus.AVAILABLE,
  })
  status: RunStatus;

  @ManyToOne(() => Event, (event) => event.runs)
  event: Event;

  @ManyToOne(() => RunCategory, (runCategory) => runCategory.runs, {
    eager: true,
  })
  runCategory: RunCategory;

  @OneToMany(() => RunPurchase, (purchase) => purchase.run)
  purchases: RunPurchase[];
}
