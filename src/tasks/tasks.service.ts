import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BusinessPersonWithoutPasswordDto } from 'src/business-persons/dto/businessPerson-without-password.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { PagenationDto } from 'src/common/dto/pagenation.dto';
import { MovingStatusEnum } from 'src/common/movingStatus.enum';
import { SendSystemMessage } from '../common/send-systemMessages';
import { BusinessPersons } from 'src/entities/BusinessPersons';
import { MovingInformations } from 'src/entities/MovingInformations';
import { Negotiations } from 'src/entities/Negotiations';
import { SystemMessages } from 'src/entities/SystemMessages';
import { EventsGateway } from 'src/events/events.gateway';
import { Connection, Repository } from 'typeorm';
import { NegoCostDto } from './dto/nego-cost.dto';
const util = require('util');

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(BusinessPersons)
        private businessPersonsRepository: Repository<BusinessPersons>,
        @InjectRepository(Negotiations)
        private negotiationsRepository: Repository<Negotiations>,
        @InjectRepository(MovingInformations)
        private movingInformationsRepository: Repository<MovingInformations>,
        @InjectRepository(SystemMessages)
        private systemMessagesRepository: Repository<MovingInformations>,
        private eventsGateway: EventsGateway,
        private connection: Connection,
    ) {}

    // NEGO테이블을 확인하여 견적서 요청 시점에서 24시간이 경과된 경우 알림메시지 발송
    // router에 요청이 들어올 때마다 예약하는 경우 서버다운이 발생하면 예약작업이 사라지므로 이 방법을 선택
    @Cron(CronExpression.EVERY_5_MINUTES)
    async checkNegoTimout() {
        console.log('Cron is alive at:::', Date.now());
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // 견적 제출 후 24시간 경과 여부 조회
            const timeoutFilter = await this.negotiationsRepository
                .createQueryBuilder('nego')
                .innerJoin('nego.MovingInformation', 'movingInfo')
                .select('movingInfo.UserId', 'userId')
                .where('DATE_ADD(nego.createdAt, INTERVAL 1 DAY) < NOW()')
                .andWhere('nego.timeout IS FALSE')
                .andWhere('nego.cost IS NULL')
                .execute();
            console.log('timeoutFilter:::', timeoutFilter);
    
            if (timeoutFilter.length === 0) {
                return;
            }
    
            let values = [];
            for (let i = 0; i < timeoutFilter.length; i++) {
                const value = {
                    UserId: timeoutFilter[i].userId,
                    message: SendSystemMessage.TIMEOUT_NEGO,
                }
                values.push(value);
            }
            console.log('valuses:::', values)
    
            await this.systemMessagesRepository
                .createQueryBuilder('system_messages', queryRunner)
                .insert()
                .into('system_messages')
                .values(values)
                .execute()
    
            const timeoutList = timeoutFilter.map((v) => v.userId)
            console.log('timeoutList:::', timeoutList)
    
            await this.negotiationsRepository
                .createQueryBuilder('Negotiations', queryRunner)
                .leftJoin(
                    'Negotiations.MovingInformation', 
                    'movingInfo', 
                    'movingInfo.UserId = :ids', { 
                        ids: timeoutList 
                })
                .update('Negotiations')
                .set({ timeout: true })
                .where('Negotiations.cost IS NULL')
                .execute();
    
            await queryRunner.commitTransaction();
            } catch (error) {
                await queryRunner.rollbackTransaction();
                console.log(error);
                throw error;
            } finally {
                await queryRunner.release();
            }
    }

    async checkMovingToDone(checkDone, businessPersonId, movingInfoId, queryRunner) {
        // 이사완료 연타로 인한 기사님 finish_count 중복 덧셈 방지
        console.log('checkDone:::', checkDone);
        if (checkDone?.MovingStatusId === MovingStatusEnum.DONE) {
            throw new ForbiddenException('이미 완료된 이사건입니다.')
        }

        if (checkDone) {
            const exFinishCount = await this.businessPersonsRepository
                .createQueryBuilder('businessPerson')
                .select('businessPerson.finish_count')
                .where('id = :id', { id: businessPersonId })
                .getOne();
            console.log('exFinishCount:::', exFinishCount)

            await this.businessPersonsRepository
                .createQueryBuilder('BusinessPersons', queryRunner)
                .update('BusinessPersons')
                .set({ finish_count: exFinishCount.finish_count +1 })
                .where('id = :id', { id: businessPersonId })
                .execute();

            await this.movingInformationsRepository
                .createQueryBuilder('MovingInformations', queryRunner)
                .update('MovingInformations')
                .set({ MovingStatusId: MovingStatusEnum.DONE })
                .where('id = :id', { id: movingInfoId })
                .execute();
            }
    }

    async submitMovingInfo(userId: number) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // 이삿짐을 만들 때 기존 생성된 이사정보의 상태가 DONE이 아니면 생성되지 않게 하였지만
            // 오류를 대비하여 전부 조회하도록 함.
            const isNegoing = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .where('movingInfo.UserId = :id', { id: userId })
                .getMany();
            console.log('isNegoing:::', isNegoing)
    
            // 견적서 반복제출 방지
            if (isNegoing.find((v) => v.MovingStatusId === (
                MovingStatusEnum.NEGO || 
                MovingStatusEnum.PICK
            ))) {
                throw new ForbiddenException('이미 진행 중인 이사정보가 존재합니다.');
            }

            // 견적요청은 가장 최근 이사정보로 보내지도록
            const movingInfoToNego = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .where('movingInfo.UserId = :id', { id: userId })
                .orderBy('movingInfo.createdAt', 'DESC')
                .getOne();
            console.log('movingInfoToNego:::', movingInfoToNego);

            if (!movingInfoToNego) {
                throw new NotFoundException('이삿짐 정보가 존재하지 않습니다.');
            }

            await this.negotiationsRepository
                .createQueryBuilder('negotiations', queryRunner)
                .insert()
                .into('negotiations')
                .values({
                    MovingInformationId: movingInfoToNego.id,
                })
                .execute();

            // 견적 요청 시 STAY -> NEGO
            await this.movingInformationsRepository
                .createQueryBuilder('negotiations', queryRunner)
                .update('moving_informations')
                .set({ 
                    MovingStatusId: MovingStatusEnum.NEGO 
                })
                .where('id = :id', { id: movingInfoToNego.id })
                .execute();

            await queryRunner.commitTransaction();
        
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getMovingInfoList(
        pagenation: PagenationDto,
        businessPerson: BusinessPersonWithoutPasswordDto
    ) { 
        // NEGO 중인 submitMovingInfo 중에서 기사님 관심 area_code들과 일치하는 결과만 리턴
        try {
            const { perPage, page } = pagenation;
            const businessPersonAreaCodes = businessPerson.AreaCodes.map((v) => v);
            console.log('businessPersonAreaCodes:::', businessPersonAreaCodes);

            const movingInfoList = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .innerJoin('movingInfo.AreaCode', 'AC')
                .select([
                    'movingInfo.id',
                    'movingInfo.start_point', 
                    'movingInfo.destination',
                    'movingInfo.createdAt',
                ])
                .where('movingInfo.MovingStatusId = :id', { 
                    id: MovingStatusEnum.NEGO 
                })
                .andWhere('movingInfo.timeout IS FALSE')
                .andWhere('AC.code In (:...codes)', { codes: 
                    businessPersonAreaCodes 
                })
                .take(perPage)
                .skip(perPage * (page - 1))
                .getMany();
            console.log('results:::', movingInfoList)

            if (movingInfoList.length === 0) {
                throw new NotFoundException('현재 담당 지역에서 견적 요청이 존재하지 않습니다..')
            }
    
            return { 'movingInfoList': movingInfoList, 'status': 200 }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getMovingInfoDetail(movingInfoId: number) {
        try {
            // 특정 견적요청 게시물을 클릭 때의 게시물 상태 확인
            const isNotNegoing = await this.movingInformationsRepository
            .createQueryBuilder('movingInfo')
            .where('movingInfo.id = :id', { id: movingInfoId })
            .andWhere('movingInfo.MovingStatusId IN (:...ids )', { ids: [
                MovingStatusEnum.STAY,
                MovingStatusEnum.PICK,
                MovingStatusEnum.DONE,
            ]})
            .getOne();
            console.log('isNotNegoing:::', isNotNegoing)

            if (isNotNegoing) {
                throw new ForbiddenException('견적 요청 완료/취소된 게시물입니다.');
            }

            const result = await this.movingInformationsRepository
            .createQueryBuilder('movingInfo')
            .innerJoin('movingInfo.AreaCode', 'areacode')
            .innerJoin('movingInfo.MovingGoods', 'goods')
            .leftJoin('goods.LoadImages', 'images')
            .select([
                'movingInfo.id',
                'movingInfo.start_point',
                'movingInfo.destination',
                'movingInfo.move_date',
                'movingInfo.move_time',
                'movingInfo.createdAt',
            ])
            .addSelect(
                'areacode.code'
            )
            .addSelect([
                'goods.bed', 
                'goods.closet',
                'goods.storage_closet',
                'goods.table',
                'goods.sofa',
                'goods.box',
            ])
            .addSelect(
                'images.img_path'
            )
            .where('movingInfo.id = :id', { id: movingInfoId })
            .getOne();
            console.log('result:::', result)

            if (!result) {
                throw new NotFoundException('게시물이 존재하지 않습니다.')
            }

            return { "results" : result, 'status' : 200 }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async submitEstimate(
        movingInfoId: number, 
        businessPersonId: number,
        cost: NegoCostDto
    ) {
        try {
            const findMovingInfo = await this.negotiationsRepository
                .createQueryBuilder('nego')
                .where('nego.MovingInformationId = :movingInfoId', { movingInfoId })
                .andWhere('nego.BusinessPersonId IS NULL')
                .andWhere('nego.timeout IS FALSE')
                .andWhere('nego.cost IS NULL')
                .getOne();
            console.log('findMovingInfo:::', findMovingInfo);

            if (!findMovingInfo) {
                throw new NotFoundException('해당 견적요청이 존재하지 않습니다.');
            }

            const isDuplication = await this.negotiationsRepository
                .createQueryBuilder('nego')
                .where('nego.MovingInformationId = :movingInfoId', { movingInfoId })
                .andWhere('nego.BusinessPersonId = :businessPersonId', { businessPersonId })
                .getOne();
            console.log('isDuplication:::', isDuplication);
    
            if (isDuplication) {
                throw new ForbiddenException('이미 해당 견적요청에 응답하셨습니다.');
            }
    
            const countNegoByBusinessPersons = async (movingInfoId): Promise<number> => {
                const result = await this.negotiationsRepository
                .createQueryBuilder('nego')
                .select('COUNT(nego.cost)', 'count')
                .where('nego.MovingInformationId = :movingInfoId', { movingInfoId })
                .andWhere('nego.cost IS NOT NULL')
                .getRawOne();
        
                return +result.count;
            }
    
            // 기존 제출된 견적서 10개 여부 확인(기사님들 견적서 10개 이상 제출 방지)
            const checkBeforeSubmitCount = await countNegoByBusinessPersons(movingInfoId);
            console.log('checkBeforeSubmitCount:::', checkBeforeSubmitCount);
    
            if (checkBeforeSubmitCount >= 10) {
                throw new ForbiddenException('이미 10건의 견적서 제출이 완료되었습니다');
            }
    
            // 견적금액 적어서 제출
            await this.negotiationsRepository
                .createQueryBuilder()
                .insert()
                .into('negotiations')
                .values({
                    cost,
                    MovingInformationId: movingInfoId,
                    BusinessPersonId: businessPersonId,
                })
                .execute();

            // 현재 제출된 견적서 추가 합계 확인
            const checkAfterSubmitCount = await countNegoByBusinessPersons(movingInfoId);
            console.log('checkAfterSubmitCount:::', checkAfterSubmitCount);
    
            const owner = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .innerJoin('movingInfo.User', 'user')
                .addSelect(['user.id', 'user.name', 'user.email'])
                .where('movinginfo.id = :movingInfoId', { movingInfoId })
                .getOne();
            console.log('owner:::', owner);

            if (!owner) { 
                throw new NotFoundException('견적 요청을 한 유저가 존재하지 않습니다.')
            }

            if (checkAfterSubmitCount <= 10) {
                // 웹소켓으로 접속중인 견적요청한 유저에게 실시간 견적서 제출 현황 알려주기
                // 시나리오: Front에서 유저 email로 이름을 가진 room 생성(join)/message 구독해 놓은 상태 -> 서버에서 유저 email로 room 입장 -> room에 메지시 발송/room 퇴장
                // ** Front에서 sockeId를 보내주면 room 없이 to()만으로 가능하지만 학습을 위해 이와 같이 사용.
                this.eventsGateway.server.emit('login', { email: owner.User.email }); // 유저와 같은 room 입장
                this.eventsGateway.server.to(owner.User.email)
                    .emit('message', { data: `현재 ${checkAfterSubmitCount}건의 견적을 받으셨습니다!`
                })
                this.eventsGateway.server.emit('logout', { email: owner.User.email }); // 같은 room에 접속한 다른 기사님 견적제출 알림 받지 않기위해 소켓 연결 해제
            }
    
            // 받은 견적서 10개 도달시 유저에게 system 메시지 발송 / timeout true
            if (checkAfterSubmitCount === 10) {
                const sendSystemMessage = await this.systemMessagesRepository
                    .createQueryBuilder()
                    .insert()
                    .into('system_messages')
                    .values({
                        UserId: owner.User.id,
                        message: SendSystemMessage.FINISH_NEGO,
                    })
                    .execute();
                console.log('sendSystemMessage:::', sendSystemMessage);

                await this.negotiationsRepository
                    .createQueryBuilder()
                    .update('negotiations')
                    .set({
                        timeout: true
                    })
                    .where('negotiations.MovingInformationId = :id', {
                        id: movingInfoId
                    })
                    .andWhere('negotiations.cost IS NULL')
                    .execute();
            }

        return { 'message' : '견적서 제출 완료!', 'status' : 201 }
        } catch (error) {
            console.log(error);
            throw error;
        } 
    }

    async checkEstimateList(userId: number) {
        try {
            const myMovingInfo = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .where('movingInfo.UserId = :userId', { userId })
                .andWhere('movingInfo.MovingStatusId = :id', { id: MovingStatusEnum.NEGO })
                .orderBy('movingInfo.createdAt', "DESC")
                .getOne();
            console.log('myMovingInfo:::', myMovingInfo)

            if (!myMovingInfo) {
                throw new NotFoundException('견적요청 중인 이삿짐 정보가 없습니다.')
            }
    
            // 받은 견적 리스트 10개 중 낮은 가격순으로 5개만 return
            const estimateList = await this.negotiationsRepository
                .createQueryBuilder('nego')
                .innerJoin('nego.BusinessPerson', 'businessPerson')
                .innerJoin('nego.MovingInformation', 'movingInfo')
                .innerJoin('businessPerson.Reviews', 'reviews')
                .innerJoin('reviews.User', 'reviewer')
                .select([
                    'nego.id',
                    'nego.cost'
                ])
                .addSelect([
                    'businessPerson.id',
                    'businessPerson.name',
                    'businessPerson.finish_count',
                ])
                .addSelect([
                    'reviews.id',
                    'reviews.star',
                    'reviews.writer',
                    'reviews.content', 
                    'reviews.createdAt',
                ])
                .addSelect('reviewer.name')
                .addSelect('movingInfo.id')
                .where('nego.MovingInformationId = :id', { id: myMovingInfo.id })
                .andWhere('nego.cost IS NOT NULL')
                .orderBy('reviews.createdAt', 'DESC')
                .addOrderBy('nego.cost', 'ASC')
                .take(5)
                .getMany();
    
            if (estimateList.length === 0) {
                return { 'message' : '받은 견적 내역이 없습니다.', 'status' : 200}
            }
    
            //  기사님 각각의 리뷰 별점 평균 포함시키기
            for (let i = 0; i < estimateList.length; i++) {
                let stars = 0;
                for (let j = 0; j < estimateList[i].BusinessPerson.Reviews.length; j++) {
                    stars += estimateList[i].BusinessPerson.Reviews[j].star;
                }
                let starAvg = stars / estimateList[i].BusinessPerson.Reviews.length;
                estimateList[i].BusinessPerson['starsAvg'] = 
                    Math.round(starAvg * 10) / 10;
            }
    
            console.log(
                'estimateList:::', util.inspect(estimateList, { depth: null }), 
                'length:::', estimateList.length
            );
    
            return { 'estimateList' : estimateList, 'status': 200 }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // 견적서 pick하기(NEGO -> PICK)
    async pickEstimate(
        movingInfoId: number, 
        businessPersonId: number
    ) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const checkBusinessPerson = await this.businessPersonsRepository
                .createQueryBuilder('businessPerson')
                .where('businessPerson.id = :id', { id: businessPersonId })
                .getOne();
    
            if (!checkBusinessPerson) {
                throw new NotFoundException('존재하지 않거나 탈퇴한 기사님입니다.');
            }
    
            const checkAleadyPicked = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .where('movingInfo.id = :id', { id: movingInfoId })
                .getOne()
            console.log('checkAleadyPicked:::', checkAleadyPicked);
    
            if (checkAleadyPicked.picked_business_person !== null) {
                throw new ForbiddenException(
                    `이미 '${checkBusinessPerson.name}'기사님의 견적서를 선택하셨습니다.`
                );
            }
    
            // 선택된 기사님 id 입력, 현재 진행상태 변경(NEGO -> PICK)
            await this.movingInformationsRepository
                .createQueryBuilder('MovingInformations', queryRunner)
                .update('MovingInformations')
                .set({ 
                    picked_business_person: businessPersonId,
                    MovingStatusId: MovingStatusEnum.PICK,
                })
                .where('id = :id', { id: movingInfoId })
                .execute();
            
            // 선택된 기사님에게 알림 주기
            await this.systemMessagesRepository
                .createQueryBuilder('system_messages', queryRunner)
                .insert()
                .into('system_messages')
                .values({
                    BusinessPersonId: businessPersonId,
                    message: SendSystemMessage.PICKED_NEGO,
                })
                .execute();
    
            await queryRunner.commitTransaction();
            return { 'message' : '기사님 선택 완료!', 'status' : 201 }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async makeMovingToDoneByUser(
        movingInfoId: number, 
        businessPersonId: number,
    ) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const checkCondition = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo', queryRunner)
                .where('movingInfo.id = :id', { id: movingInfoId })
                .getOne();
            console.log('checkCondition:::', checkCondition);

            if (checkCondition.user_done) {
                throw new ForbiddenException('이미 완료 확인을 하셨습니다.');
            }

            if (checkCondition.MovingStatusId !== MovingStatusEnum.PICK) {
                throw new ForbiddenException('잘못된 접근입니다.');
            }

            await this.movingInformationsRepository
                .createQueryBuilder('MovingInformations', queryRunner)
                .update('MovingInformations')
                .set({ 
                    user_done: true, 
                })
                .where('id = :movingInfoId', { movingInfoId })
                .andWhere('picked_business_person = :businessPersonId', { 
                    businessPersonId 
                })
                .execute();
    
            // 기사님 이사완료 체크여부 확인
            const checkedBusinessPersonDone = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .where('movingInfo.id = :id', { id: movingInfoId })
                .andWhere('movingInfo.picked_business_person', { businessPersonId })
                .andWhere('movingInfo.business_person_done IS TRUE')
                .getOne();
            console.log('checkBusinessPersonDone:::', checkedBusinessPersonDone);

            // 상대방이 이사완료 체크를 안했다면 알림 가도록
            if (!checkedBusinessPersonDone) {
                await this.systemMessagesRepository
                .createQueryBuilder('system_messages', queryRunner)
                .insert()
                .into('system_messages')
                .values({
                    BusinessPersonId: businessPersonId,
                    message: SendSystemMessage.FINISH_MOVING,
                })
                .execute();
            }
    
            // 유저 + 기사님 완료의 경우 -> 기사님 이사완료 카운트 +1, movingInfo 상태 PICK -> DONE
            await this.checkMovingToDone(
                checkedBusinessPersonDone, 
                businessPersonId, 
                movingInfoId, 
                queryRunner
            );

            await queryRunner.commitTransaction();
    
            return { 'message' : '유저 이사완료 확인', 'status' : 201 }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async makeMovingToDoneByBusinessPerson(
        movingInfoId: number, 
        businessPersonId: number,
    ) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();      
        try {
            const checkCondition = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo', queryRunner)
                .where('movingInfo.id = :id', { id: movingInfoId })
                .getOne();
            console.log('checkCondition:::', checkCondition);

            if (checkCondition.business_person_done) {
                throw new ForbiddenException('이미 완료 확인을 하셨습니다.');
            }      

            if (checkCondition.MovingStatusId !== MovingStatusEnum.PICK) {
                throw new ForbiddenException('잘못된 접근입니다.');
            }
            
            await this.movingInformationsRepository
                .createQueryBuilder('MovingInformations', queryRunner)
                .update('MovingInformations')
                .set({ 
                    business_person_done: true, 
                })
                .where('id = :movingInfoId', { movingInfoId })
                .andWhere('picked_business_person = :businessPersonId', { 
                    businessPersonId 
                })
                .execute();
    
            // 유저 완료 체크여부 확인
            const checkedUserDone = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .where('movingInfo.id = :id', { id: movingInfoId })
                .andWhere('movingInfo.picked_business_person', { businessPersonId })
                .andWhere('movingInfo.user_done IS TRUE')
                .getOne();
            console.log('checkedUserDone:::', checkedUserDone);

            if (!checkedUserDone) {
                await this.systemMessagesRepository
                .createQueryBuilder('system_messages', queryRunner)
                .insert()
                .into('system_messages')
                .values({
                    UserId: checkCondition.UserId,
                    message: SendSystemMessage.FINISH_MOVING,
                })
                .execute();
            }
    
            await this.checkMovingToDone(
                checkedUserDone, 
                businessPersonId, 
                movingInfoId, 
                queryRunner
            );

            await queryRunner.commitTransaction();
    
            return { 'message' : '기사님 이사완료 확인', 'status' : 201 }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
