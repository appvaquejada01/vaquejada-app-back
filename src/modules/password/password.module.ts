import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';

import { Category, Event, Password, Subscription } from 'src/entities';

import * as Services from './services';
import { PasswordController } from './controllers';

const typeOrmEntities = [Password];

const services = Object.values(Services);

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
    TypeOrmModule.forFeature([Password, Event, Category, Subscription]),
  ],
  controllers: [PasswordController],
  providers: [...services],
  exports: [],
})
export class PasswordModule {}
