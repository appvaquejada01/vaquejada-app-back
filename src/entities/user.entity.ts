import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Event } from './event.entity';
import { UserNatureEnum, UserRoleEnum } from '../modules/user/enums';
import { AuditableAttributesWithTimeZone } from '../shared/entities/auditable.entity';

@Entity('users')
export class User extends AuditableAttributesWithTimeZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  nature: UserNatureEnum;

  @Column({ type: 'varchar', nullable: false, unique: true, length: 100 })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  phone: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  cpf: string;

  @Column({ type: 'varchar', default: UserRoleEnum.USER, nullable: false })
  role: UserRoleEnum;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar', nullable: true, length: 2 })
  state: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];
}
