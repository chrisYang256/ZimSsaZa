import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AreaCodes } from 'src/entities/AreaCodes';
import { BusinessPersons } from 'src/entities/BusinessPersons';
import { MovingInformations } from 'src/entities/MovingInformations';
import { Reviews } from 'src/entities/Reviews';
import { SystemMessages } from 'src/entities/SystemMessages';
import { BusinessPersonsController } from './business-persons.controller';
import { BusinessPersonsService } from './business-persons.service';

@Module({
  controllers: [BusinessPersonsController],
  providers: [BusinessPersonsService],
  imports: [
    TypeOrmModule.forFeature([
      BusinessPersons,
      Reviews,
      AreaCodes,
      SystemMessages,
      MovingInformations,
    ]),
    AuthModule,
  ],
})
export class BusinessPersonsModule {}
