import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PasswordStatusEnum } from 'src/modules/password/enums';
import { AuditableAttributesWithTimeZone } from 'src/shared/entities';

import { Event } from './event.entity';
import { Category } from './category.entity';
import { Subscription } from './subscription.entity';

@Entity('passwords')
export class Password extends AuditableAttributesWithTimeZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'varchar',
    default: PasswordStatusEnum.AVAILABLE,
  })
  status: PasswordStatusEnum;

  @ManyToOne(() => Event, (event) => event.passwords)
  event: Event;

  @Column()
  eventId: string;

  @ManyToOne(() => Category, (category) => category.passwords)
  category: Category;

  @Column()
  categoryId: string;

  @OneToMany(() => Subscription, (subscription) => subscription.password)
  subscriptions: Subscription[];

  @Column({ type: 'timestamp', nullable: true })
  soldAt: Date;
}
