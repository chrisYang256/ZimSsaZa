import dotenv from 'dotenv';
import * as path from 'path';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Users } from "./src/entities/Users";
import { Reviews } from './src/entities/Reviews';
import { MovingInformations } from './src/entities/MovingInformations';
import { MovingStatuses } from './src/entities/MovingStatuses';
import { MovingGoods } from './src/entities/MovingGoods';
import { LoadImages } from './src/entities/LoadImages';
import { BusinessPersons } from './src/entities/BusinessPersons';
import { AreaCodes } from './src/entities/AreaCodes';
import { Negotiations } from './src/entities/Negotiations';
import { SystemMessages } from './src/entities/SystemMessages';

dotenv.config({
    path: path.resolve(
      (process.env.NODE_ENV === 'production') 
        ? '.production.env'
        : '.development.env'
    )
  });
console.log('process.env.NODE_ENV:::', process.env.NODE_ENV);

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
        SystemMessages,
    ],
    synchronize: false,
    logging: process.env.NODE_ENV === 'production' ? false : true,
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    cli: { migrationsDir: 'src/migrations' },
    keepConnectionAlive: true,
    charset: 'utf8mb4',
}

export = config;