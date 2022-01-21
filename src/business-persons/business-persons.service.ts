import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessPersons } from 'src/entities/BusinessPersons';
import { CreateBusinessPersonDto } from './dto/create-businessPerson.dto';
import { Connection, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { AreaCodes } from 'src/entities/AreaCodes';
import { SystemMessages } from 'src/entities/SystemMessages';
import { PagenationDto } from 'src/common/dto/pagenation.dto';

@Injectable()
export class BusinessPersonsService {
    constructor(
        @InjectRepository(BusinessPersons)
        private businessPersonsRepository: Repository<BusinessPersons>,
        @InjectRepository(AreaCodes)
        private areaCodesRepository: Repository<AreaCodes>,
        @InjectRepository(SystemMessages)
        private systemMessages: Repository<SystemMessages>,
        private connection: Connection,
    ) {}

    async signUp(createBusinessPersonDto: CreateBusinessPersonDto) {
        const { name, email, password, phone_number, business_license, code } = createBusinessPersonDto;
        const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const phoneNumberRegex = /^010-\d{3,4}-\d{4}$/;

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();

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

        const license = await this.businessPersonsRepository
            .createQueryBuilder('business_persons')
            .where('business_persons.business_license = :bl', { bl: business_license })
            .getOne();

        if (license) {
            throw new ForbiddenException(`'${business_license}'는 이미 가입된 사업자번호입니다.`);
        }

        const user = await this.businessPersonsRepository
            .createQueryBuilder('business_persons')
            .where('business_persons.email = :email', { email })
            .getOne();

        if (user) {
            throw new ForbiddenException(`'${email}'는 이미 가입된 이메일입니다.`);
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
    
        console.log('isTransactionActive-1:::', queryRunner.isTransactionActive);
        await queryRunner.startTransaction();
        console.log('isTransactionActive-2:::', queryRunner.isTransactionActive);
        try {
            const bp = await this.businessPersonsRepository
                .createQueryBuilder('business_persons', queryRunner)
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
            console.log('create bp:::', bp);

            let results = [];
            for (let i = 0; i < code.length; i++) {
                const result = {
                    code: code[i],
                    BusinessPersonId: bp.identifiers[0].id,
                }
                results.push(result);
            } // [1, 2, 'string'] 의 경우 rollback 실행 확인 
            console.log('results:::', results);

            await this.areaCodesRepository
            .createQueryBuilder('area_codes', queryRunner)
            .insert()
            .into('area_codes')
            .values(results)
            .execute();

            await queryRunner.commitTransaction();
            console.log('isTransactionActive-3:::', queryRunner.isTransactionActive);

            return { 'message': '회원 가입 성공', 'statusCode': 201 };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async readMessage(
        businessPersonId: number,
        pagenation: PagenationDto
    ) {
        const { perPage, page } = pagenation;

        const messages = await this.systemMessages
            .createQueryBuilder('message')
            .select(['message.message', 'message.createdAt'])
            .where('message.BusinessPersonId = :businessPersonId', { 
                businessPersonId 
            })
            .orderBy('message.createdAt', 'DESC')
            .take(perPage)
            .skip(perPage * (page - 1))
            .getMany();
        console.log('my messages:::', messages.length);

        if ((messages.length <= 1) && (+page === 1)) {
            await this.systemMessages
                .createQueryBuilder()
                .update('system_messages')
                .set({ updatedAt: new Date() })
                .where('UserId = :BusinessPersonId', { businessPersonId })
                .orderBy('updatedAt', 'DESC')
                .limit(1)
                .execute();
        }

        return { 'message' : messages, 'status:' : 200 }
    }

    async unreadCount(businessPersonId: number) {
        const checkLastDate = await this.systemMessages
            .createQueryBuilder('message')
            .select('MAX(CONVERT_TZ(message.updatedAt, "+0:00", "+9:00"))', 'lastReadAt')
            .where('message.BusinessPersonId = :businessPersonId', { businessPersonId })
            .getRawOne();
        console.log('lastcheckDate:::', checkLastDate.lastReadAt);
        
        const count = await this.systemMessages
            .createQueryBuilder('message')
            .where('message.BusinessPersonId = :businessPersonId', { businessPersonId })
            .andWhere('message.createdAt > :lastReadAt', { 
                lastReadAt: checkLastDate.lastReadAt
            })
            .getCount();
        console.log('count:::', count);

        return { 'count' : count, 'status:' : 200 }
    }
}
