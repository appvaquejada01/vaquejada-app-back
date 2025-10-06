import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { User } from 'src/entities';
import { ConnectionTypeEnum } from 'src/utils/database';
import { InsertQueryResponse } from 'src/shared/types/typeorm';
import { CreateFullUserDto } from '../dto/create-full-user.dto';
import {
  CpfAlreadyInUseException,
  EmailAlreadyInUseException,
} from '../exceptions';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { UserRoleEnum } from '../enums';

@Injectable()
export class CreateFullUserService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
  ) {}

  public async create(
    dto: CreateFullUserDto,
    user: AuthenticatedUser,
  ): Promise<CreateFullUserDto> {
    if (user.role !== UserRoleEnum.ADMIN) {
      throw new Error('Apenas administradores podem criar usuários completos.');
    }

    await this.validateUserExistence(dto.cpf, dto.email);
    const createdUser = await this.insertUser(dto, user.userId);

    return CreateFullUserDto.fromEntity(createdUser);
  }

  private async validateUserExistence(cpf: string, email: string) {
    const existingUserCPF = await this.dataSource
      .createQueryBuilder(User, 'user')
      .select('user.id')
      .where('user.cpf = :cpf', { cpf })
      .getOne();

    if (existingUserCPF) {
      throw new CpfAlreadyInUseException();
    }

    const existingUserEmail = await this.dataSource
      .createQueryBuilder(User, 'user')
      .select('user.id')
      .where('user.email = :email', { email })
      .getOne();

    if (existingUserEmail) {
      throw new EmailAlreadyInUseException();
    }
  }

  private async insertUser(
    dto: CreateFullUserDto,
    userId: string,
  ): Promise<User> {
    const hashedPassword = await this.hashPassword(dto.password);
    const [createdUser]: InsertQueryResponse<User> =
      await this.dataSource.query(
        `
      INSERT INTO 
        "users" (name, email, password, cpf, phone, nature, role, city, state, "isActive", "createdAt", "createdFunctionName", "createdUserId")
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), $11, $12)
      RETURNING *;`,
        [
          dto.name,
          dto.email,
          hashedPassword,
          dto.cpf,
          dto.phone,
          dto.nature ?? null,
          dto.role ?? 'user',
          dto.city ?? null,
          dto.state ?? null,
          dto.isActive ?? true,
          'CreateFullUserService.create',
          userId,
        ],
      );
    return createdUser;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
