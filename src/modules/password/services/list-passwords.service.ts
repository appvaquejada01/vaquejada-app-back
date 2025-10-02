import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Password } from 'src/entities';
import { PasswordResponseDto, QueryListPasswordDto } from '../dto';

@Injectable()
export class ListPasswordsService {
  constructor(
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
  ) {}

  async findAll(query: QueryListPasswordDto): Promise<PasswordResponseDto[]> {
    const { eventId, categoryId } = query;

    const qb = this.passwordRepository.createQueryBuilder('password');

    if (eventId) {
      qb.andWhere('password.eventId = :eventId', { eventId });
    }

    if (categoryId) {
      qb.andWhere('password.categoryId = :categoryId', { categoryId });
    }

    if (query.status) {
      qb.andWhere('password.status = :status', { status: query.status });
    }

    const passwords = await qb.getMany();

    return passwords.map((password) =>
      PasswordResponseDto.fromEntity(password),
    );
  }
}
