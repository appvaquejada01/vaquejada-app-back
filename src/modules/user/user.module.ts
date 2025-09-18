import { Module } from '@nestjs/common';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from '../../utils/database';

import { User } from '../../entities';
import { UserController } from './controllers';
import { CreateUserService } from './services';

const typeOrmEntities = [User];

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
  ],
  controllers: [UserController],
  providers: [CreateUserService],
  exports: [],
})
export class UserModule {}
