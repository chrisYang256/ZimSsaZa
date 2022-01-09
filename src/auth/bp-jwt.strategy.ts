import dotenv from 'dotenv';
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessPersons } from 'src/entities/BusinessPersons';

dotenv.config();

@Injectable()
export class BPJwtStrategy extends PassportStrategy(Strategy, 'bp-jwt') {
    constructor(
        @InjectRepository(BusinessPersons)
        private businessPersons: Repository<BusinessPersons>,
        ) {
        super({
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload) {
        const bp: BusinessPersons = await this.businessPersons
            .createQueryBuilder('businessPersons')
            .where('businessPersons.id = :id', { id: payload.id })
            .getOne();

        if (!bp) {
            throw new ForbiddenException('유효하지 않은 토큰입니다.');
        }
        
        return bp;
    }
}