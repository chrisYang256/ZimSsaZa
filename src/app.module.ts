import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import * as ormconfig from './ormconfig';
import { LoggerMiddleware } from './middlewares/logger.middlewares';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';
import { BusinessPersonsModule } from './business-persons/business-persons.module';
import { TasksModule } from './tasks/tasks.module';
import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    UsersModule,
    BusinessPersonsModule,
    TasksModule,
    EventsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
