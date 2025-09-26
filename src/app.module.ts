import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppDataSource } from './config/database';
import { ConnectionTypeEnum } from './utils/database';

import { UserModule } from './modules/user/user.module';
import { EventModule } from './modules/event/event.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { EventCategoryModule } from './modules/event-category/event-category.module';

const imports = [
  TypeOrmModule.forRootAsync({
    useFactory: () => AppDataSource.options,
  }),
  TypeOrmModule.forRootAsync({
    name: ConnectionTypeEnum.READONLY,
    useFactory: () => AppDataSource.options,
  }),
  AuthModule,
  UserModule,
  EventModule,
  CategoryModule,
  EventCategoryModule,
];

@Module({ imports })
export class AppModule {}
