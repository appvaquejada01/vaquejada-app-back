import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';
import { User } from 'src/entities';

import { EventModule } from '../event/event.module';

import { StaffController } from './controllers';

import * as Services from './services';

const services = Object.values(Services);

const typeOrmEntities = [User];

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => EventModule),
  ],
  controllers: [StaffController],
  providers: [...services],
  exports: [TypeOrmModule],
})
export class StaffModule {}
