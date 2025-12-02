import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { User } from 'src/entities';
import { ConnectionTypeEnum } from 'src/utils/database';
import { InsertQueryResponse } from 'src/shared/types/typeorm';

import {
  CpfAlreadyInUseException,
  EmailAlreadyInUseException,
} from '../exceptions';
import { CreateUserDto } from '../dto';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { UserRoleEnum } from '../enums';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
  ) {}

  public async create(
    dto: CreateUserDto,
  ): Promise<{ user: CreateUserDto; access_token: string }> {
    // await this.validateUserExistence(dto.cpf, dto.email);

    const createdUser = await this.insertUser(dto);

    const access_token = this.generateAccessToken(createdUser);

    return {
      user: CreateUserDto.fromEntity(createdUser),
      access_token,
    };
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

  private async insertUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(dto.password);

    const [createdUser]: InsertQueryResponse<User> =
      await this.dataSource.query(
        `
      INSERT 
        INTO "users" (name, email, password, cpf, phone, role, "createdAt", "createdFunctionName")
      VALUES 
        ($1, $2, $3, $4, $5, $6, NOW(), $7)
      RETURNING *;`,
        [
          dto.name,
          dto.email,
          hashedPassword,
          dto.cpf,
          dto.phone,
          UserRoleEnum.RUNNER,
          'CreateUserService.create',
        ],
      );

    return createdUser;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private generateAccessToken(user: User): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.authService['jwtService'].sign(payload);
  }
}
