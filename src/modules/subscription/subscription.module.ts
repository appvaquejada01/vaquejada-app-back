import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';

import * as Services from './services';
import { Subscription } from 'src/entities';
import { SubscriptionController } from './controllers';

const typeOrmEntities = [Subscription];

const services = Object.values(Services);

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
    TypeOrmModule.forFeature([Subscription]),
  ],
  controllers: [SubscriptionController],
  providers: [...services],
  exports: [],
})
export class SubscriptionModule {}
