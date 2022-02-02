import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AreaCodes } from 'src/entities/AreaCodes';
import { LoadImages } from 'src/entities/LoadImages';
import { MovingGoods } from 'src/entities/MovingGoods';
import { MovingInformations } from 'src/entities/MovingInformations';
import { Negotiations } from 'src/entities/Negotiations';
import { Reviews } from 'src/entities/Reviews';
import { SystemMessages } from 'src/entities/SystemMessages';
import { Users } from 'src/entities/Users';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Reviews,
      Negotiations,
      MovingGoods,
      LoadImages,
      AreaCodes,
      SystemMessages,
      MovingInformations,
    ]),
    AuthModule,
  ],
})
export class UsersModule {}
