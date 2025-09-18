import { Module } from '@nestjs/common';

import {
  ConnectionTypeEnum,
  typeOrmForFeatureToConnection,
} from 'src/utils/database';
import { Category } from 'src/entities/category.entity';

const typeOrmEntities = [Category];

@Module({
  imports: [
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.DEFAULT),
    typeOrmForFeatureToConnection(typeOrmEntities, ConnectionTypeEnum.READONLY),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CategoryModule {}
