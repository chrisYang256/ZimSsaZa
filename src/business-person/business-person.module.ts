import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BusinessPersons } from 'src/entities/BusinessPersons';
import { BusinessPersonController } from './business-person.controller';
import { BusinessPersonService } from './business-person.service';

@Module({
    controllers: [BusinessPersonController],
    providers: [BusinessPersonService],
    imports: [
        TypeOrmModule.forFeature([
            BusinessPersons,
        ]),
        AuthModule,
    ]
})
export class BusinessPersonModule {}
