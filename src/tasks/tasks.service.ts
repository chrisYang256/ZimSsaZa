import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BPWithoutPasswordDto } from 'src/business-persons/dto/bp-without-password.dto';
import { PagenationDto } from 'src/common/dto/pagenation.dto';
import { MovingStatusEnum } from 'src/common/movingStatus.enum';
import { AreaCodes } from 'src/entities/AreaCodes';
import { BusinessPersons } from 'src/entities/BusinessPersons';
import { LoadImages } from 'src/entities/LoadImages';
import { MovingGoods } from 'src/entities/MovingGoods';
import { MovingInformations } from 'src/entities/MovingInformations';
import { Negotiations } from 'src/entities/Negotiations';
import { Users } from 'src/entities/Users';
import { Connection, Repository } from 'typeorm';
import { NegoCostDto } from './dto/nego-cost.dto';
const util = require('util')

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(BusinessPersons)
        private businessPersonsRepository: Repository<BusinessPersons>,
        @InjectRepository(Negotiations)
        private negotiationsRepository: Repository<Negotiations>,
        @InjectRepository(MovingInformations)
        private movingInformationsRepository: Repository<MovingInformations>,
        @InjectRepository(MovingGoods)
        private movingGoodsRepository: Repository<MovingGoods>,
        @InjectRepository(LoadImages)
        private loadImageRepository: Repository<LoadImages>,
        @InjectRepository(AreaCodes)
        private areaCodesRepository: Repository<AreaCodes>,
        private connection: Connection,
    ) {}

    async submitMovingInfo(userId: number) {
        try {
            const isNegoing = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .where('movingInfo.UserId = :id', { id: userId })
                .getMany();
            console.log('isNegoing:::', isNegoing)
    
            if (isNegoing.find((v) => v.MovingStatusId === MovingStatusEnum.NEGO)) { // 견적 장난질 방지
                throw new ForbiddenException('이미 견적을 받고 있는 이삿짐이 존재합니다.')
            }

            const movingInfoToNego = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .where('movingInfo.UserId = :id', { id: userId })
                .orderBy('movingInfo.createdAt', 'DESC')
                .getOne();
            console.log('movingInfoToNego:::', movingInfoToNego)
    
            // 견적요청은 자동으로 가장 최근에 만든 이사정보로 보내지도록
            await this.negotiationsRepository
                .createQueryBuilder()
                .insert()
                .into('negotiations')
                .values({
                    MovingInformationtId: movingInfoToNego.id,
                })
                .execute();

            // 견적 요청 시 STAY -> NEGO
            await this.movingInformationsRepository
                .createQueryBuilder()
                .update('moving_informations')
                .set({ MovingStatusId: MovingStatusEnum.NEGO })
                .where('id = :id', { id: movingInfoToNego.id })
                .execute();

            // scheduler로 24시간 경과(nego table createAt으로) 확인로직 추가하기!!

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getMovingInfoList(
        pagenation: PagenationDto,
        businessPerson: BPWithoutPasswordDto
    ) { 
        // NEGO 중인 submitMovingInfo 중에서 기사님 관심 area_code들과 일치하는 결과만 리턴
        try {
            const { perPage, page } = pagenation;
            const bpAreaCodes = businessPerson.AreaCodes.map((v) => v);
            console.log('bpAreaCodes:::', bpAreaCodes);

            const movingInfoList = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .innerJoin('movingInfo.AreaCode', 'AC')
                .select([
                    'movingInfo.id',
                    'movingInfo.start_point', 
                    'movingInfo.destination',
                    'movingInfo.createAt',
                ])
                .where('movingInfo.MovingStatusId = :id', { 
                    id: MovingStatusEnum.NEGO 
                })
                .andWhere('AC.code In (:...codes)', { codes: bpAreaCodes })
                .take(perPage)
                .skip(perPage * (page - 1))
                .getMany();
            console.log('results:::', movingInfoList)
    
            return { 'movingInfoList': movingInfoList, 'status': 200 }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getMovingInfo(movingInfoId: number) {
        try {
            // 특정 견적요청 게시물 버튼을 눌렀을 때의 게시물 상태 확인
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

            const results = await this.movingInformationsRepository
            .createQueryBuilder('movingInfo')
            .innerJoin('movingInfo.AreaCode', 'areacode')
            .innerJoin('movingInfo.MovingGoods', 'goods')
            .leftJoin('goods.LoadImags', 'images')
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
            console.log('results:::', results)

            if (results === undefined) {
                return new NotFoundException('게시물이 존재하지 않습니다.')
            }

            return { "results" : results, 'status' : 200 }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async submitNegoCost(
        movingInfoId: number, 
        businessPersonId: number,
        cost: NegoCostDto
        ) {
        // 동일한 견적요청에 대해 1번만 견적을 제출할 수 있도록 체크
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
            const countNegoByBps = await this.negotiationsRepository
            .createQueryBuilder('nego')
            .select('COUNT(nego.cost)', 'count')
            .where('nego.MovingInformationId = :movingInfoId', { movingInfoId })
            .andWhere('nego.cost IS NOT NULL')
            .getRawOne();
    
            return +countNegoByBps.count;
        }

        // 기존 제출된 견적서 10개 여부 확인(기사님들 견적서 10개 이상 제출 방지)
        const checkBeforeSubmitCost = await countNegoByBusinessPersons(movingInfoId);
        console.log('checkBeforeSubmitCost:::', checkBeforeSubmitCost);


        if (checkBeforeSubmitCost >= 10) {
            throw new ForbiddenException('이미 10건의 견적서 제출이 완료되었습니다');
        }

        // nego 테이블에서 견적받을 row 조회
        const findNego = await this.negotiationsRepository
            .createQueryBuilder('nego')
            .where('nego.MovingInformationId = :movingInfoId', { movingInfoId })
            .andWhere('nego.BusinessPersonId IS NULL')
            .andWhere('nego.cost IS NULL')
            .getOne();
        console.log('findNego:::', findNego);

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

        // 현재 제출된 견적서 추가 합계 10개 여부 확인, 10개 도달 시 유저에게 알림
        const checkAfterSubmitCost = await countNegoByBusinessPersons(movingInfoId);
        console.log('checkAfterSubmitCost:::', checkAfterSubmitCost);

        if (checkAfterSubmitCost >= 10) {
            // 10개 완료시 유저에게 알림 로직 추가하기!!(웹소켓)
            return { 'message' : '견적 신청이 완료되었습니다. 확인해주세요!' } // after 10개 체크 test
        }
    }

    async checkEestimateList(movingInfoId: number) {
        // 받은 견적 리스트 10개 중 낮은 가격순으로 5개만 return
        const estimateList = await this.negotiationsRepository
            .createQueryBuilder('nego')
            .innerJoin('nego.BusinessPerson', 'businessPerson')
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
                'reviews.content', 
                'reviews.createdAt',
            ])
            .addSelect(['reviewer.name'])
            .where('nego.MovingInformationId = :id', { id: movingInfoId })
            .andWhere('nego.cost IS NOT NULL')
            .orderBy('reviews.createdAt', 'DESC')
            .addOrderBy('nego.cost', 'ASC')
            .take(5)
            .getMany();

        //  기사님 각각의 리뷰 별점 평균 포함시키기
        for (let i = 0; i < estimateList.length; i++) {
            let stars = 0;
            for (let j = 0; j < estimateList[i].BusinessPerson.Reviews.length; j++) {
                stars += estimateList[i].BusinessPerson.Reviews[j].star
            }
            let AVGstars =  stars / estimateList[i].BusinessPerson.Reviews.length
            estimateList[i].BusinessPerson['averageOfStarsCount'] = Math.round(AVGstars * 10) / 10;
        }

        console.log(
            'estimateList:::', util.inspect(estimateList, { depth: null }), 
            'length:::', estimateList.length
        );

        return estimateList;
    }


    // 견적서 pick하기(NEGO -> PICK)

    // 이사 완료(PICK -> DONE)
}
