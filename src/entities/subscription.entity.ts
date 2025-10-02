import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionStatus } from 'src/modules/subscription/enum';
import { AuditableAttributesWithTimeZone } from 'src/shared/entities';

import { User } from './user.entity';
import { Event } from './event.entity';
import { Score } from './score.entity';
import { Category } from './category.entity';
import { Password } from './password.entity';

@Entity('subscriptions')
export class Subscription extends AuditableAttributesWithTimeZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Event, (event) => event.subscriptions)
  event: Event;

  @Column()
  eventId: string;

  @ManyToOne(() => Category, (category) => category.subscriptions)
  category: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => Password, (password) => password.subscriptions)
  password: Password;

  @Column()
  passwordId: string;

  @OneToMany(() => Score, (score) => score.subscription)
  scores: Score[];

  @Column({ type: 'varchar', default: SubscriptionStatus.PENDING })
  status: SubscriptionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  subscribedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date;
}
