import { ForbiddenException, Injectable } from '@nestjs/common';
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

    async submitMovingInfo(myId: number) {
        try {
            const isSubmitting = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .where('movingInfo.UserId = :id', { id: myId })
                .getMany();
            console.log('isSubmitting:::', isSubmitting)
    
            if (isSubmitting.find((v) => v.MovingStatusId === MovingStatusEnum.NEGO)) { // 견적 장난질 방지
                throw new ForbiddenException('이미 견적을 받고 있는 이삿짐이 존재합니다.')
            }

            const movingInfoToNego = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .where('movingInfo.UserId = :id', { id: myId })
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

            // scheduler로 24시간 경과(nego table createAt으로 확인)시 nego -> stay
            // 기사 견적 체크로 견적 10개 초과 여부(nego table cost로 확인) 체크
            // 둘 다 유저에게 알림 필요 -> 웹소켓 사용 

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getMovingInfoList(
        bp: BPWithoutPasswordDto,
        pagenation: PagenationDto
    ) {
        const { perPage, page } = pagenation;
        const bpAreaCodes = bp.AreaCodes.map((v) => v);
        console.log('bpAreaCodes:::', bpAreaCodes);
        
        // NEGO 중인 submitMovingInfo 중에서 기사님 관심 area_code들과 일치하는 결과만 리턴
        const movingInfoList = await this.movingInformationsRepository
            .createQueryBuilder('movingInfo')
            .innerJoin('movingInfo.AreaCode', 'AC')
            .select([
                'movingInfo.id',
                'movingInfo.start_point', 
                'movingInfo.destination',
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
    }

    // 이사견적 요청 상세정보 조회
    async getMovingInfo(movingInfoId) {
        try {
            const movingInfo = await this.movingInformationsRepository
            .createQueryBuilder('movingInfo')
            .innerJoin('movingInfo.AreaCode', 'areacode')
            .innerJoin('movingInfo.MovingGoods', 'goods')
            .innerJoin('goods.LoadImags', 'images')
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
            .where('movingInfo.UserId = :id', { id: movingInfoId.id })
            .orderBy('movingInfo.createdAt', "DESC")
            .getOne();
        console.log('movingInfo:::', movingInfo)

        return { "movingInfo" : movingInfo };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // 기사님 이사 견적 제출하기
    async submitNegoCost(movingInfoId, bp) {

    }
}
