import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessPersons } from 'src/entities/BusinessPersons';
import { Users } from 'src/entities/Users';
import { AuthService } from './auth.service';
import { BPJwtStrategy } from './bp-jwt.strategy';
import { BPLocalStrategy } from './bp-local.strategy';
import { UserJwtStrategy } from './user-jwt.strategy';
import { UserLocalStrategy } from './user-local.strategy';

@Module({
  providers: [
    AuthService, 
    UserLocalStrategy, 
    UserJwtStrategy, 
    BPLocalStrategy,
    BPJwtStrategy,
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      Users, 
      BusinessPersons,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRESIN }
    }),
  ],
  exports: [AuthService]
})
export class AuthModule {}
