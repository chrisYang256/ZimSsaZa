import dotenv from 'dotenv';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Users } from "./entities/Users";
import { Reviews } from './entities/Reviews';
import { Movements } from './entities/Movements';
import { MoveStatuses } from './entities/MoveStatuses';
import { LoadInformations } from './entities/LoadInformations';
import { LoadImages } from './entities/LoadImages';
import { BusinessPersons } from './entities/BusinessPersons';
import { AreaCodes } from './entities/AreaCodes';
import { Negotiations } from './entities/Negotiations';

dotenv.config();

const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.BD_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        Users,
        Reviews,
        Negotiations,
        MoveStatuses,
        Movements,
        LoadInformations,
        LoadImages,
        BusinessPersons,
        AreaCodes,
    ],
    synchronize: true,
    logging: true,
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    cli: { migrationsDir: 'src/migrations' },
    keepConnectionAlive: true,
    charset: 'utf8mb4',
}

export = config;