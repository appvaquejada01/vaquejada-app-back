import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Category, User } from 'src/entities';
import { Event } from 'src/entities/event.entity';
import { UserRoleEnum } from 'src/modules/user/enums';
import { ConnectionTypeEnum } from 'src/utils/database';
import { InsertQueryResponse } from 'src/shared/types/typeorm';

import { EventStatusEnum } from '../enums';
import { CreateEventDto, CreateEventResponseDto } from '../dto';

@Injectable()
export class CreateEventService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateEventDto): Promise<CreateEventResponseDto> {
    const event = await this.createEvent(dto);

    console.log(event);
    console.log(dto);
    await Promise.all([
      this.relateJudges(event.id, dto.judgeIds),
      this.relateSpeakers(event.id, dto.speakerIds),
      this.relateRunners(event.id, dto.runnerIds),
      this.updateCategories(event.id, dto.categories),
    ]);

    const [judges, speakers, runners, categories] = await Promise.all([
      this.findUserByIdsAndRole(dto.judgeIds, UserRoleEnum.JUDGE),
      this.findUserByIdsAndRole(dto.speakerIds, UserRoleEnum.SPEAKER),
      this.findUserByIdsAndRole(dto.runnerIds, UserRoleEnum.RUNNER),
      this.findCategoryByIds(dto.categories),
    ]);

    return CreateEventResponseDto.fromEntity(
      event,
      judges,
      speakers,
      runners,
      categories,
    );
  }

  private async createEvent(dto: CreateEventDto): Promise<Event> {
    const [event]: InsertQueryResponse<Event> = await this.dataSource.query(
      `
      INSERT INTO 
        "events" 
        (name, 
        "startAt", 
        "endAt", 
        "purchaseClosedAt", 
        "inscriptionPrice", 
        "inscriptionLimit", 
        status,
        description,
        address, 
        city, 
        state,
        "createdFunctionName") 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING 
        id, 
        name, 
        "startAt", 
        "endAt", 
        description,
        "organizerId", 
        "purchaseClosedAt", 
        "inscriptionPrice", 
        "inscriptionLimit", 
        status,
        city, 
        state,
        address`,
      [
        dto.name,
        dto.startAt,
        dto.endAt,
        dto.purchaseClosedAt,
        dto.inscriptionPrice,
        dto.inscriptionLimit,
        EventStatusEnum.SCHEDULED,
        dto.description,
        dto.address,
        dto.city,
        dto.state,
        'CreateEventService.create',
      ],
    );

    return event;
  }

  private async relateJudges(eventId: string, judgeIds: string[]) {
    for (const judgeId of judgeIds) {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('events_judges_users')
        .values({ eventsId: eventId, usersId: judgeId })
        .execute();
    }
  }

  private async relateSpeakers(eventId: string, speakerIds: string[]) {
    if (!speakerIds?.length) return;
    for (const speakerId of speakerIds) {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('events_speakers_users')
        .values({ eventsId: eventId, usersId: speakerId })
        .execute();
    }
  }

  private async relateRunners(eventId: string, runnerIds: string[]) {
    if (!runnerIds?.length) return;
    for (const runnerId of runnerIds) {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('events_runners_users')
        .values({ eventsId: eventId, usersId: runnerId })
        .execute();
    }
  }

  private async updateCategories(eventId: string, categories: string[]) {
    if (!categories?.length) return;
    for (const categoryId of categories) {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('events_categories_categories')
        .values({ eventsId: eventId, categoriesId: categoryId })
        .execute();
    }
  }

  private async findUserByIdsAndRole(userIds: string[], role: UserRoleEnum) {
    return this.dataSource
      .createQueryBuilder(User, 'user')
      .select(['user.id', 'user.name', 'user.email', 'user.role'])
      .where('user.id IN (:...userIds)', { userIds })
      .andWhere('user.role = :role', { role: role })
      .getMany();
  }

  private async findCategoryByIds(categories: string[]): Promise<Category[]> {
    return this.dataSource
      .createQueryBuilder(Category, 'category')
      .select([
        'category.id',
        'category.name',
        'category.startAt',
        'category.endAt',
        'category.observation',
        'category.passQuantity',
        'category.inscriptionPrice',
      ])
      .where('category.id IN (:...categories)', { categories })
      .getMany();
  }
}
