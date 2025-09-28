import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CategoryNameEnum } from '../modules/category/enums/category-name.enum';
import { AuditableAttributesWithTimeZone } from '../shared/entities/auditable.entity';

import { EventCategory } from './event-category.entity';
import { Subscription } from './subscription.entity';
import { Password } from './password.entity';

@Entity('categories')
export class Category extends AuditableAttributesWithTimeZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  name: CategoryNameEnum;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  rules: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => EventCategory, (eventCategory) => eventCategory.category)
  eventCategories: EventCategory[];

  @OneToMany(() => Password, (password) => password.category)
  passwords: Password[];

  @OneToMany(() => Subscription, (subscription) => subscription.category)
  subscriptions: Subscription[];
}
