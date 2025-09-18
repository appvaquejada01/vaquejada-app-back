import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

import { CategoryNameEnum } from 'src/modules/category/enums';
import { AuditableAttributesWithTimeZone } from 'src/shared/entities';

import { Event } from './event.entity';

@Entity('categories')
export class Category extends AuditableAttributesWithTimeZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: CategoryNameEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  inscriptionPrice: number;

  @Column({ type: 'varchar', length: 1000 })
  observation: string;

  @Column({ type: 'timestamptz' })
  startAt: string;

  @Column({ type: 'timestamptz' })
  endAt: string;

  @Column({ type: 'int', nullable: false })
  passQuantity: number;

  @ManyToMany(() => Event, (event) => event.categories)
  events: Event[];
}
