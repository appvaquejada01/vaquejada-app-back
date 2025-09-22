import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Category } from './category.entity';
import { Run, RunStatus } from './run.entity';
import { AuditableAttributesWithTimeZone } from 'src/shared/entities';

@Entity('run_categories')
export class RunCategory extends AuditableAttributesWithTimeZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string; // Ex: "Números 0-100", "Área Premium"

  @Column({ type: 'int' })
  startNumber: number; // Número inicial: 0

  @Column({ type: 'int' })
  endNumber: number; // Número final: 100

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // Preço por número nesta categoria

  @Column({ type: 'int' })
  totalNumbers: number; // Total de números: 101

  @Column({ type: 'int', default: 0 })
  availableNumbers: number; // Números disponíveis

  @ManyToOne(() => Event, (event) => event.runCategories)
  event: Event;

  @ManyToOne(() => Category, (category) => category.runCategories, {
    nullable: true,
  })
  category: Category;

  @OneToMany(() => Run, (run) => run.runCategory)
  runs: Run[];

  calculateAvailableNumbers(): number {
    return this.runs
      ? this.runs.filter((run) => run.status === RunStatus.AVAILABLE).length
      : 0;
  }

  isSoldOut(): boolean {
    return this.availableNumbers <= 0;
  }
}
