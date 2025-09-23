import { Module } from '@nestjs/common';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../entities';
import * as Services from './services';
import { UserController } from './controllers';

const typeOrmEntities = [User];

const services = Object.values(Services);

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [...services],
  exports: [TypeOrmModule],
})
export class UserModule {}
