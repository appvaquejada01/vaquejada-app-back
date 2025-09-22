import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Category } from './category.entity';
import { RunPurchase } from './run-purchase.entity';
import { AuditableAttributesWithTimeZone } from 'src/shared/entities';

@Entity('event_categories')
export class EventCategory extends AuditableAttributesWithTimeZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // Preço ESPECÍFICO para este evento

  @Column({ type: 'timestamptz' })
  startAt: string; // Data/hora ESPECÍFICA para este evento

  @Column({ type: 'timestamptz' })
  endAt: string; // Data/hora ESPECÍFICA para este evento

  @Column({ type: 'int' })
  maxRunners: number; // Limite de competidores

  @Column({ type: 'int', default: 0 })
  currentRunners: number; // Competidores inscritos

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // Se a categoria está ativa no evento

  @ManyToOne(() => Event, (event) => event.eventCategories)
  event: Event;

  @ManyToOne(() => Category, (category) => category.eventCategories)
  category: Category;

  @OneToMany(() => RunPurchase, (runPurchase) => runPurchase.eventCategory)
  runPurchases: RunPurchase[];
}
