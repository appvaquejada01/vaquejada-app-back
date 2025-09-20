import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { User } from 'src/entities';
import { ListUserResponseDto, QueryUserDto } from '../dto';

@Injectable()
export class ListUserService {
  constructor(private readonly dataSource: DataSource) {}

  async list(query: QueryUserDto): Promise<ListUserResponseDto[]> {
    const qb = this.dataSource.getRepository(User).createQueryBuilder('user');

    if (query.createdAt) {
      qb.andWhere('DATE(user.createdAt) = :createdAt', {
        createdAt: query.createdAt,
      });
    }
    if (query.role) {
      qb.andWhere('user.role = :role', { role: query.role });
    }
    if (query.cpf) {
      qb.andWhere('user.cpf = :cpf', { cpf: query.cpf });
    }
    if (query.name) {
      qb.andWhere('user.name ILIKE :name', { name: `%${query.name}%` });
    }

    const users = await qb.getMany();

    return users.map(ListUserResponseDto.fromEntity);
  }
}
