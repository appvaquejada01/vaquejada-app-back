import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from '../../utils/database';

import { Event } from '../../entities';
import * as Services from './services';
import { EventController } from './controllers';
import { UserModule } from '../user/user.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

const typeOrmEntities = [Event];

const services = Object.values(Services);

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => UserModule),
    forwardRef(() => CloudinaryModule),
  ],
  controllers: [EventController],
  providers: [...services],
  exports: [TypeOrmModule],
})
export class EventModule {}
