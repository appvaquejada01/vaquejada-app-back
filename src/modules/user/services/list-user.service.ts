import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ListUserResponseDto, QueryUserDto } from '../dto';

@Injectable()
export class ListUserService {
  constructor(private readonly dataSource: DataSource) {}

  async list(query: QueryUserDto): Promise<ListUserResponseDto[]> {
    const qb = this.dataSource.getRepository('users').createQueryBuilder('u');

    if (query.createdAt) {
      qb.andWhere('DATE(u.createdAt) = :createdAt', {
        createdAt: query.createdAt,
      });
    }
    if (query.role) {
      qb.andWhere('u.role = :role', { role: query.role });
    }
    if (query.cpf) {
      qb.andWhere('u.cpf = :cpf', { cpf: query.cpf });
    }
    if (query.name) {
      qb.andWhere('u.name ILIKE :name', { name: `%${query.name}%` });
    }

    const users = await qb.getMany();

    return users.map(ListUserResponseDto.fromEntity);
  }
}
