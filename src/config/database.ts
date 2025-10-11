import { DataSource } from 'typeorm';
import { prodDbConfig } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: prodDbConfig.url,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migration/**/*.js'],
  synchronize: false,
  logging: false,
  ssl: { rejectUnauthorized: false },
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conectado ao Postgres com TypeORM');
    return AppDataSource;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Erro ao conectar com o banco:', error.message);
    } else {
      console.error('❌ Erro ao conectar com o banco:', error);
    }
    throw error;
  }
};
