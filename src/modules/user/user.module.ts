import { Module } from '@nestjs/common';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';

import { User } from '../../entities';
import { UserController } from './controllers';
import { CreateUserService, UpdateUserService } from './services';

const typeOrmEntities = [User];

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
  ],
  controllers: [UserController],
  providers: [CreateUserService, UpdateUserService],
  exports: [],
})
export class UserModule {}
