import { Module } from '@nestjs/common';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';
import { Category } from 'src/entities/category.entity';

import * as Services from './services';
import { CategoryController } from './controllers';

const typeOrmEntities = [Category];

const services = Object.values(Services);

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
  ],
  controllers: [CategoryController],
  providers: [...services],
  exports: [],
})
export class CategoryModule {}
