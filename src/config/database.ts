import { DataSource } from 'typeorm';
import { dbConfig } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migration/**/*.js'],
  synchronize: false,
  logging: false,
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
