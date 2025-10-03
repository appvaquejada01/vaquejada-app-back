import { Injectable } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { User } from 'src/entities';
import { GetUserResponseDto, QueryUserDto } from '../dto';

@Injectable()
export class ListUserService {
  constructor(private readonly dataSource: DataSource) {}

  async list(query: QueryUserDto): Promise<GetUserResponseDto[]> {
    const qb = this.createQueryBuilder();
    this.mapFilters(qb, query);

    const users = await qb.getMany();

    return users.map(GetUserResponseDto.fromEntity);
  }

  private createQueryBuilder() {
    return this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.cpf',
        'user.name',
        'user.email',
        'user.nature',
        'user.role',
        'user.phone',
        'user.city',
        'user.state',
        'user.isActive',
      ]);
  }

  private mapFilters(
    qb: SelectQueryBuilder<User>,
    query: QueryUserDto,
  ): SelectQueryBuilder<User> {
    const { name, cpf, createdAt, role } = query;

    if (createdAt) {
      qb.andWhere('DATE(user.createdAt) = :createdAt', {
        createdAt: createdAt,
      });
    }

    if (role) {
      qb.andWhere('user.role = :role', { role: role });
    }

    if (cpf) {
      qb.andWhere('user.cpf = :cpf', { cpf: cpf });
    }

    if (name) {
      qb.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    }

    return qb;
  }
}
