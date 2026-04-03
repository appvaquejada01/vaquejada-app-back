import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';
import { Event, Score, User } from 'src/entities';

import { EventModule } from '../event/event.module';
import { SubscriptionModule } from '../subscription/subscription.module';

import { SpeakerVoteSummaryController, StaffController } from './controllers';

import * as Services from './services';

const services = Object.values(Services);

const typeOrmEntities = [User, Score, Event];

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => EventModule),
    forwardRef(() => SubscriptionModule),
  ],
  controllers: [StaffController, SpeakerVoteSummaryController],
  providers: [...services],
  exports: [TypeOrmModule],
})
export class StaffModule {}
