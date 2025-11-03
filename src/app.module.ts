import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppDataSource } from './config/database';
import { ConnectionTypeEnum } from './utils/database';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { EventModule } from './modules/event/event.module';
import { CategoryModule } from './modules/category/category.module';
import { PasswordModule } from './modules/password/password.module';
import { EventCategoryModule } from './modules/event-category/event-category.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { StaffModule } from './modules/staff/staff.module';

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
  PasswordModule,
  SubscriptionModule,
  EventCategoryModule,
  PaymentsModule,
  StaffModule,
];

@Module({ imports })
export class AppModule {}
