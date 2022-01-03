import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Users } from "./entities/Users";

dotenv.config();

const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        Users,
    ],
    synchronize: true,
    logging: true,
    migrations: [__dirname + '/src/migrations/*.{ts,js}'],
    cli: { migrationsDir: 'src/migrations' },
    keepConnectionAlive: true,
    charset: 'utf8mb4',
}

export = config;