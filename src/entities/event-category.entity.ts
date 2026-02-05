import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Category } from './category.entity';
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

  @Column({ type: 'int', default: 0 })
  passwordLimit: number; // Limite de senha para categoria

  @Column({ type: 'int', default: 0 })
  cattleQuantity: number; // Quantidade de boi por categoria

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  prize: number; // Premiação da categoria

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // Se a categoria está ativa no evento

  @ManyToOne(() => Event, (event) => event.eventCategories)
  event: Event;

  @ManyToOne(() => Category, (category) => category.eventCategories)
  category: Category;

  isAvailable(): boolean {
    return this.currentRunners < this.maxRunners && this.isActive;
  }

  canRegister(): boolean {
    return this.isAvailable() && new Date() < new Date(this.startAt);
  }
}
