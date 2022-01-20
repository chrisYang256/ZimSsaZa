import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AreaCodes } from 'src/entities/AreaCodes';
import { BusinessPersons } from 'src/entities/BusinessPersons';
import { LoadImages } from 'src/entities/LoadImages';
import { MovingGoods } from 'src/entities/MovingGoods';
import { MovingInformations } from 'src/entities/MovingInformations';
import { Negotiations } from 'src/entities/Negotiations';
import { SystemMessages } from 'src/entities/SystemMessages';
import { Users } from 'src/entities/Users';
import { EventsModule } from 'src/events/events.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    TypeOrmModule.forFeature([
      Users,
      BusinessPersons,
      Negotiations,
      MovingInformations,
      MovingGoods,
      LoadImages,
      AreaCodes,
      SystemMessages,
    ]),
    AuthModule,
    EventsModule,
  ]
})
export class TasksModule {}
