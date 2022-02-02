import dotenv from 'dotenv';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessPersons } from 'src/entities/BusinessPersons';

dotenv.config();

@Injectable()
export class BusinessPersonJwtStrategy extends PassportStrategy(
  Strategy,
  'businessPerson-jwt',
) {
  constructor(
    @InjectRepository(BusinessPersons)
    private businessPersons: Repository<BusinessPersons>,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const businessPerson: BusinessPersons = await this.businessPersons
      .createQueryBuilder('businessPersons')
      .addSelect('businessPersons.business_license')
      .leftJoin('businessPersons.AreaCodes', 'areacodes')
      .addSelect('areacodes.code')
      .where('businessPersons.id = :id', { id: payload.id })
      .getOne();

    if (!businessPerson) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return businessPerson;
  }
}
