import dotenv from 'dotenv';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

dotenv.config();

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        ) {
        super({
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload) {
        const user: Users = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id: payload.id })
            .getOne();

        if (!user) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }
        
        return user;
    }
}