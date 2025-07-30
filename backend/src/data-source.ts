import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Filme } from './filme/entities/filme.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const options: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User, Filme],
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
};

export const AppDataSource = new DataSource(options);
