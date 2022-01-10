import dotenv from 'dotenv';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Users } from "./entities/Users";
import { Reviews } from './entities/Reviews';
import { MovingInformations } from './entities/MovingInformations';
import { MovingStatuses } from './entities/MovingStatuses';
import { MovingGoods } from './entities/MovingGoods';
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
        LoadImages,
        Negotiations,
        BusinessPersons,
        AreaCodes,
        MovingGoods,
        MovingStatuses,
        MovingInformations,
    ],
    synchronize: true,
    logging: true,
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    cli: { migrationsDir: 'src/migrations' },
    keepConnectionAlive: true,
    charset: 'utf8mb4',
}

export = config;