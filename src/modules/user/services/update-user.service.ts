import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { User } from 'src/entities';
import { ConnectionTypeEnum } from 'src/utils/database';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { UpdateQueryResponse } from 'src/shared/types/typeorm';

import { UserRoleEnum } from '../enums';
import { UserNotFoundException } from '../exceptions';
import { UpdateUserDto, UpdateUserResponseDto } from '../dto';

@Injectable()
export class UpdateUserService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
  ) {}

  public async update(
    userId: string,
    dto: UpdateUserDto,
    requestUser: AuthenticatedUser,
  ): Promise<UpdateUserResponseDto> {
    const existingUser = await this.findUserById(userId);

    const updatedUser = await this.updateUserInfo(
      existingUser,
      dto,
      requestUser,
    );

    if (requestUser.role === UserRoleEnum.ADMIN && dto.password) {
      const hashedPassword = await this.hashPassword(dto.password);

      await this.updatePassword(
        existingUser.id,
        hashedPassword,
        requestUser.userId,
      );
    }

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
        'user.isActive',
      ])
      .where('user.id = :userId', { userId })
      .getOne();

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    return existingUser;
  }

  private async updateUserInfo(
    existingUser: User,
    dto: UpdateUserDto,
    requestUser: AuthenticatedUser,
  ): Promise<User> {
    const updatedRole =
      requestUser.role !== UserRoleEnum.ADMIN ? existingUser.role : dto.role;

    const updatedIsActive =
      requestUser.role !== UserRoleEnum.ADMIN
        ? existingUser.isActive
        : dto.isActive;

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
        role = $7,
        "isActive" = $8,
        "updatedAt" = NOW(),
        "updatedUserId" = $9,
        "updatedFunctionName" = $10
      WHERE 
        id = $11
      RETURNING
        id, name, email, cpf, nature, phone, city, state;`,
        [
          dto.name,
          dto.email,
          dto.nature,
          dto.phone,
          dto.city,
          dto.state,
          updatedRole,
          updatedIsActive,
          'UpdateUserService.update',
          requestUser.userId,
          existingUser.id,
        ],
      );

    return updatedUser;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private async updatePassword(
    userId: string,
    hashedPassword: string,
    updateUserId: string,
  ): Promise<void> {
    await this.dataSource.query(
      `
    UPDATE 
      "users"
    SET 
      password = $1,
      "updatedUserId" = $2,
      "updatedAt" = NOW(),
      "updatedFunctionName" = $3
    WHERE 
      id = $4;`,
      [
        hashedPassword,
        updateUserId,
        'UpdateUserService.updatePassword',
        userId,
      ],
    );
  }
}
