import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { User } from 'src/entities';
import { ConnectionTypeEnum } from 'src/utils/database';

import { UpdateUserDto, UpdateUserResponseDto } from '../dto';
import { UserNotFoundException } from '../exceptions';
import { UpdateQueryResponse } from 'src/shared/types/typeorm';

@Injectable()
export class UpdateUserService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
  ) {}

  public async update(
    userId: string,
    dto: UpdateUserDto,
    requestUserId: string,
  ): Promise<UpdateUserResponseDto> {
    const existingUser = await this.findUserById(userId);

    const updatedUser = await this.updateUserInfo(
      existingUser.id,
      dto,
      requestUserId,
    );

    return UpdateUserResponseDto.fromEntity(updatedUser);
  }

  private async findUserById(userId: string): Promise<User> {
    const existingUser = await this.dataSource
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
      ])
      .where('user.id = :userId', { userId })
      .getOne();

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    return existingUser;
  }

  private async updateUserInfo(
    userId: string,
    dto: UpdateUserDto,
    requestUserId: string,
  ): Promise<User> {
    const [[updatedUser]]: UpdateQueryResponse<User> =
      await this.dataSource.query(
        `
      UPDATE 
        "users"
      SET 
        name = $1,
        email = $2,
        nature = $3,
        phone = $4,
        city = $5,
        state = $6,
        "updatedAt" = NOW(),
        "updatedUserId" = $7,
        "updatedFunctionName" = $8
      WHERE 
        id = $9
      RETURNING
        id, name, email, cpf, nature, phone, city, state;`,
        [
          dto.name,
          dto.email,
          dto.nature,
          dto.phone,
          dto.city,
          dto.state,
          'UpdateUserService.update',
          requestUserId,
          userId,
        ],
      );

    return updatedUser;
  }
}
