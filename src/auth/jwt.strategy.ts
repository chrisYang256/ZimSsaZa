import dotenv from 'dotenv';
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id: payload.id })
            .getOne();

        if (!user) {
            throw new ForbiddenException('인증되지 않은 회원입니다.');
        }
        
        return user;
    }
}