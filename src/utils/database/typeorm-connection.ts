import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionTypeEnum } from './connection-type.enum';
import { EntityClassOrSchema } from './typeorm-classes.types';

export function typeOrmForFeatureToConnection(
  typeormClasses: EntityClassOrSchema[],
  connectionName: ConnectionTypeEnum,
): DynamicModule {
  return TypeOrmModule.forFeature(typeormClasses, connectionName);
}
