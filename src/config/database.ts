import { DataSource } from 'typeorm';
import { dbConfig } from './env';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  synchronize: false,
  logging: false,
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conectado ao MySQL com TypeORM');
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
