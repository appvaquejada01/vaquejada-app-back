import { Module } from '@nestjs/common';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from '../../utils/database';

import { Event } from '../../entities';
import * as Services from './services';
import { EventController } from './controllers';
import { UserModule } from '../user/user.module';

const typeOrmEntities = [Event];

const services = Object.values(Services);

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
    UserModule,
  ],
  controllers: [EventController],
  providers: [...services],
  exports: [],
})
export class EventModule {}
