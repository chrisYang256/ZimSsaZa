import bcrypt from 'bcrypt';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessPersons } from 'src/entities/BusinessPersons';
import { CreateBusinessPersonDto } from './dto/create-businessPerson.dto';
import { Connection, Repository } from 'typeorm';
import { AreaCodes } from 'src/entities/AreaCodes';
import { SystemMessages } from 'src/entities/SystemMessages';
import { PagenationDto } from 'src/common/dto/pagenation.dto';
import { MovingInformations } from 'src/entities/MovingInformations';
import { MovingStatusEnum } from 'src/common/movingStatus.enum';
import { BusinessPersonWithoutPasswordDto } from './dto/businessPerson-without-password.dto';
import { Reviews } from 'src/entities/Reviews';

@Injectable()
export class BusinessPersonsService {
    constructor(
        @InjectRepository(BusinessPersons)
        private businessPersonsRepository: Repository<BusinessPersons>,
        @InjectRepository(AreaCodes)
        private areaCodesRepository: Repository<AreaCodes>,
        @InjectRepository(SystemMessages)
        private systemMessagesRepository: Repository<SystemMessages>,
        @InjectRepository(MovingInformations)
        private movingInformationsRepository: Repository<MovingInformations>,
        @InjectRepository(Reviews)
        private reviewsRepository: Repository<Reviews>,
        private connection: Connection,
    ) {}

    async businessPersonInfo(
        businessPerson: BusinessPersonWithoutPasswordDto
    ) {
        const myInfo = businessPerson;
        console.log('myInfo:::', myInfo);

        const myReviews = await this.reviewsRepository
            .createQueryBuilder('reviews')
            .select([
                'reviews.star',
                'reviews.writer',
                'reviews.content',
            ])
            .where('reviews.BusinessPersonId = BusinessPersonId', { 
                BusinessPersonId: businessPerson.id 
            })
            .getMany();
        console.log('myReviews:::', myReviews);
        myInfo['myReviews'] = myReviews;

        let stars = 0
        myReviews.map((v) => stars += v.star);
        const starsAvg = Math.round(stars / myReviews.length * 10) / 10;
        myInfo['starsAvg'] = starsAvg;

        const finishMovingList = await this.movingInformationsRepository
            .createQueryBuilder('movingInfo')
            .leftJoin('movingInfo.Negotiations', 'nego')
            .select([
                'movingInfo.destination',
                'movingInfo.start_point',
                'movingInfo.move_date',
            ])
            .addSelect('nego.cost')
            .where('movingInfo.picked_business_person = :BPId', { 
                BPId: businessPerson.id 
            })
            .andWhere('movingInfo.MovingStatusId = :MSId', {
                MSId: MovingStatusEnum.DONE,
            })
            .getMany();
        console.log('finishMovingList:::', finishMovingList);
        myInfo['finishMovingList'] = finishMovingList;
        
        console.log('myInfo:::', myInfo);
        return { 'myInfo' : myInfo, 'status' : 200 }
    }

    async signUp(createBusinessPersonDto: CreateBusinessPersonDto) {
        const { name, email, password, phone_number, business_license, code } = createBusinessPersonDto;
        const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const emailRegex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
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

        if (!emailRegex.test(email)) {
            throw new ForbiddenException('이메일 형식이 올바르지 않습니다.');
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
            const businessPerson = await this.businessPersonsRepository
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
            console.log('create businessPerson:::', businessPerson);

            let results = [];
            for (let i = 0; i < code.length; i++) {
                const result = {
                    code: code[i],
                    BusinessPersonId: businessPerson.identifiers[0].id,
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

    async getScheduleList(businessPersonId: number) {
        try {
            // 이사 일자가 가까운 날부터 차례대로
            const schedule = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .select([
                    'movingInfo.id', 
                    'movingInfo.start_point', 
                    'movingInfo.destination', 
                    'movingInfo.move_date', 
                    'movingInfo.move_time',
                ])
                .where('movingInfo.picked_business_person = :PBP', { 
                    PBP: businessPersonId 
                })
                .andWhere('movingInfo.MovingStatusId = :MSId', { 
                    MSId: MovingStatusEnum.PICK
                })
                .orderBy('move_date', 'ASC')
                .getMany();
            console.log('schedule:::', schedule);
    
            if (schedule.length === 0) {
                throw new NotFoundException('예약중인 일정이 앖습니다.')
            }
            
            return { 'schedule' : schedule, 'status' : 200 }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getScheduleDetail(movingInfoId: number) {
        try {
            // 완료여부 정보까지 확인하게 하고 FE에서 완료버튼도 함께 위치하도록
            const movingInfo = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .innerJoin('movingInfo.MovingGoods', 'movingGoods')
                .innerJoin('movingGoods.LoadImages', 'images')
                .innerJoin('movingInfo.Negotiations', 'nego')
                .innerJoin('movingInfo.User', 'user')
                .select([
                    'movingInfo.start_point', 
                    'movingInfo.destination', 
                    'movingInfo.move_date', 
                    'movingInfo.move_time',
                    'movingInfo.user_done',
                    'movingInfo.business_person_done',
                ])
                .addSelect([
                    'movingGoods.bed',
                    'movingGoods.closet',
                    'movingGoods.storage_closet',
                    'movingGoods.table',
                    'movingGoods.sofa',
                    'movingGoods.box',
                ])
                .addSelect('images.img_path')
                .addSelect('nego.cost')
                .addSelect([
                    'user.name',
                    'user.phone_number'
                ])
                .where('movingInfo.id = :id', { id: movingInfoId })
                .getOne();
            console.log('movingInfo:::', movingInfo);

            if (!movingInfo) {
                throw new NotFoundException('이사 정보가 존재하지 않습니다.')
            }
    
            return { 'movingInfo' : movingInfo, 'status' : 200 }
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async readMessage(
        businessPersonId: number,
        pagenation: PagenationDto
    ) {
        try {
            const { perPage, page } = pagenation;
    
            const messages = await this.systemMessagesRepository
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

            if (messages.length === 0) {
                return { 'message' : '받은 메시지가 없습니다.', 'status' : 200 }
            }
    
            if ((messages.length >= 1) && (+page === 1)) {
                await this.systemMessagesRepository
                    .createQueryBuilder()
                    .update('system_messages')
                    .set({ updatedAt: new Date() })
                    .where('BusinessPersonId = :businessPersonId', { businessPersonId })
                    .orderBy('updatedAt', 'DESC')
                    .limit(1)
                    .execute();
            }
    
            return { 'message' : messages, 'status:' : 200 }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async unreadCount(businessPersonId: number) {
        try {
            const checkLastDate = await this.systemMessagesRepository
                .createQueryBuilder('message')
                .select('MAX(message.updatedAt)', 'lastReadAt')
                .where('message.BusinessPersonId = :businessPersonId', { businessPersonId })
                .getRawOne();
            console.log('lastcheckDate:::', checkLastDate.lastReadAt.toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul"
            }));
            
            const count = await this.systemMessagesRepository
                .createQueryBuilder('message')
                .where('message.BusinessPersonId = :businessPersonId', { businessPersonId })
                .andWhere('message.createdAt > :lastReadAt', { 
                    lastReadAt: checkLastDate.lastReadAt
                })
                .getCount();
            console.log('count:::', count);
    
            return { 'count' : count, 'status:' : 200 }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
