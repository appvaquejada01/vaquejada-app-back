import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { User } from 'src/entities';
import { ConnectionTypeEnum } from 'src/utils/database';

import { InvalidCredentialsException } from '../exceptions';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.READONLY)
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.dataSource
      .createQueryBuilder(User, 'user')
      .select(['user.id', 'user.email', 'user.password', 'user.role'])
      .where('user.email = :email', { email })
      .getOne();

    const isPasswordValid = this.validatePassword(password, user!.password);

    if (user && isPasswordValid) {
      return user;
    }

    return null;
  }

  private validatePassword(password: string, userPassword: string) {
    return bcrypt.compareSync(password, userPassword);
  }
}
