import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class AuditableAttributesWithTimeZone {
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 64, nullable: true, select: false })
  createdUserId: string;

  @Column({ type: 'varchar', length: 128, nullable: false, select: false })
  createdFunctionName: string;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
    default: null,
  })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 64, nullable: true, select: false })
  updatedUserId: string;

  @Column({ type: 'varchar', length: 128, nullable: true, select: false })
  updatedFunctionName: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'varchar', length: 64, nullable: true, select: false })
  deletedUserId: string;

  @Column({ type: 'varchar', length: 128, nullable: true, select: false })
  deletedFunctionName: string;
}
