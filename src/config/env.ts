import * as dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export const appConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  env: process.env.NODE_ENV || 'development',
};
