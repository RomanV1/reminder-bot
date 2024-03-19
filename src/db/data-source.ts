import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const dataSourceOption: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migration/*.js'],
};

const dataSource = new DataSource(dataSourceOption);
export default dataSource;
