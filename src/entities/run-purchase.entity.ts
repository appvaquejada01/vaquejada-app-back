import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Run } from './run.entity';
import { Event } from './event.entity';
import { EventCategory } from './event-category.entity';
import { AuditableAttributesWithTimeZone } from 'src/shared/entities';

export enum PurchaseStatus {
  PENDING = 'pending',
  RESERVED = 'reserved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('run_purchases')
export class RunPurchase extends AuditableAttributesWithTimeZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  runNumber: number; // ADD: Número comprado (0-500)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'varchar',
    default: PurchaseStatus.PENDING,
  })
  status: PurchaseStatus;

  @Column({ type: 'varchar', nullable: true })
  paymentMethod: string;

  @Column({ type: 'varchar', nullable: true })
  paymentId: string;

  @Column({ type: 'timestamptz', nullable: true })
  reservedUntil: Date;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean; // ADD: Se o número já foi utilizado na corrida

  @ManyToOne(() => User, (user) => user.runPurchases, { eager: true })
  user: User;

  @ManyToOne(() => Run, (run) => run.purchases, { eager: true })
  run: Run;

  @ManyToOne(() => Event, (event) => event.runPurchases, { eager: true })
  event: Event;

  @ManyToOne(
    () => EventCategory,
    (eventCategory) => eventCategory.runPurchases,
    { eager: true },
  )
  eventCategory: EventCategory;

  // @OneToMany(() => Score, (score) => score.runPurchase)
  // scores: Score[];

  canBeCancelled(): boolean {
    return (
      this.status === PurchaseStatus.PENDING ||
      this.status === PurchaseStatus.RESERVED
    );
  }

  isExpired(): boolean {
    return (
      this.status === PurchaseStatus.RESERVED && new Date() > this.reservedUntil
    );
  }
}
