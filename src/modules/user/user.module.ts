import { Module } from '@nestjs/common';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';

import {
  GetUserService,
  ListUserService,
  UpdateUserService,
  CreateUserService,
} from './services';
import { User } from '../../entities';
import { UserController } from './controllers';

const typeOrmEntities = [User];

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
  ],
  controllers: [UserController],
  providers: [
    CreateUserService,
    UpdateUserService,
    GetUserService,
    ListUserService,
  ],
  exports: [],
})
export class UserModule {}
