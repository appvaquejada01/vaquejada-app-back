import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { User } from 'src/entities';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConnectionTypeEnum } from 'src/utils/database';

import { GetUserResponseDto } from '../dto';
import { UserNotFoundException } from '../exceptions';

@Injectable()
export class GetUserService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.READONLY)
    private readonly dataSource: DataSource,
  ) {}

  async getById(userId: string): Promise<GetUserResponseDto> {
    const user = await this.findUserById(userId);

    return GetUserResponseDto.fromEntity(user);
  }

  private async findUserById(userId: string) {
    const user = await this.dataSource
      .createQueryBuilder(User, 'user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.cpf',
        'user.nature',
        'user.phone',
        'user.city',
        'user.state',
        'user.role',
        'user.isActive',
      ])
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) throw new UserNotFoundException();

    return user;
  }
}
