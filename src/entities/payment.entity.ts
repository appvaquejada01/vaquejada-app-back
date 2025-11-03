import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subscriptionId: string;

  @Column()
  gateway: string;

  @Column()
  status: string;

  @Column('numeric', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'BRL' })
  currency: string;

  @Column({ nullable: true })
  externalReference?: string;

  @Column({ nullable: true })
  mpPreferenceId?: string;   

  @Column({ nullable: true })
  mpPaymentId?: string;      

  @Column({ nullable: true })
  initPoint?: string;        

  @Column({ type: 'text', nullable: true })
  qrCode?: string;           

  @Column({ type: 'text', nullable: true })
  qrCodeBase64?: string;     

  @Column({ type: 'jsonb', nullable: true })
  raw?: any;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  updatedAt?: Date;
}
