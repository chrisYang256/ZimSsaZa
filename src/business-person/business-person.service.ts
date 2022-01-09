import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessPersons } from 'src/entities/BusinessPersons';
import { CreateBPDto } from './dto/create-bp.dto';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class BusinessPersonService {
    constructor(
        @InjectRepository(BusinessPersons)
        private businessPerson: Repository<BusinessPersons>,
    ) {}

    async signUp(createBPDto: CreateBPDto) {
        const { name, email, password, phone_number, business_license } = createBPDto;
        const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const phoneNumberRegex = /^010-\d{3,4}-\d{4}$/;

        if (email === '') {
            throw new ForbiddenException('이메일이 입력되지 않았습니다.');
        }

        if (password === '') {
            throw new ForbiddenException('비밀번호가 입력되지 않았습니다.');
        }

        if (!passwordRegex.test(password)) {
            throw new ForbiddenException('비밀번호 형식이 올바르지 않습니다.');
        }

        if (!phoneNumberRegex.test(phone_number)) {
            throw new ForbiddenException('전화번호 형식이 올바르지 않습니다.');
        }

        try {
            const license = await this.businessPerson
                .createQueryBuilder('business_persons')
                .where('business_persons.business_license = :bl', { bl: business_license })
                .getOne();

            if (license) {
                throw new ForbiddenException(`'${business_license}'는 이미 가입된 사업자번호입니다.`);
            }

            const user = await this.businessPerson
                .createQueryBuilder('business_persons')
                .where('business_persons.email = :email', { email })
                .getOne();
    
            if (user) {
                throw new ForbiddenException(`'${email}'는 이미 가입된 이메일입니다.`);
            }
    
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
    
            await this.businessPerson
                .createQueryBuilder()
                .insert()
                .into('business_persons')
                .values({ 
                    name, 
                    email, 
                    password: hashedPassword, 
                    phone_number,
                    business_license,
                })
                .execute();
            return { 'message': '회원 가입 성공', 'statusCode': 200 };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
