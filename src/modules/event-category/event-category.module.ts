import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';
import { Category, Event, EventCategory } from 'src/entities';

import * as Services from './services';
import { EventCategoryController } from './controllers';
import { PasswordModule } from '../password/password.module';

const typeOrmEntities = [EventCategory];

const services = Object.values(Services);

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
    forwardRef(() => PasswordModule),
    TypeOrmModule.forFeature([EventCategory, Event, Category]),
  ],
  controllers: [EventCategoryController],
  providers: [...services],
  exports: [],
})
export class EventCategoryModule {}
