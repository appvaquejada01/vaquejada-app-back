import { forwardRef, Module } from '@nestjs/common';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../entities';
import * as Services from './services';
import { UserController } from './controllers';
import { AuthModule } from '../auth/auth.module';

const typeOrmEntities = [User];

const services = Object.values(Services);

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [...services],
  exports: [TypeOrmModule],
})
export class UserModule {}
