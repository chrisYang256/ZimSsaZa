import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovingStatusEnum } from 'src/common/movingStatus.enum';
import { AreaCodes } from 'src/entities/AreaCodes';
import { BusinessPersons } from 'src/entities/BusinessPersons';
import { LoadImages } from 'src/entities/LoadImages';
import { MovingGoods } from 'src/entities/MovingGoods';
import { MovingInformations } from 'src/entities/MovingInformations';
import { Negotiations } from 'src/entities/Negotiations';
import { Users } from 'src/entities/Users';
import { Connection, createQueryBuilder, Repository } from 'typeorm';

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
    
            if (isSubmitting.find((v) => v.MovingStatusId === MovingStatusEnum.nego)) { // 견적 장난질 방지
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

            // moving_status STAY -> NEGO
            await this.movingInformationsRepository
                .createQueryBuilder()
                .update('moving_informations')
                .set({ MovingStatusId: MovingStatusEnum.nego })
                .where('id = :id', { id: movingInfoToNego.id })
                .execute();

            // scheduler로 24시간 경과(nego table createAt으로 확인) / 견적 10개 초과 여부(nego table cost로 확인) 체크

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // 이사견적 요청 목록 조회(내 관심지역 목록만 나오도록, 페이지네이션)

    // 이사견적 요청 상세정보 조회
    async getMovingInfo(movingInfoId) {
        try {
            const movingInfo = await this.movingInformationsRepository
            .createQueryBuilder('movingInfo')
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
            .innerJoin('movingInfo.AreaCode', 'areacode')
            .innerJoin('movingInfo.MovingGoods', 'goods')
            .innerJoin('goods.LoadImags', 'images')
            .where('movingInfo.UserId = :id', { id: movingInfoId })
            .orderBy('movingInfo.createdAt', "DESC")
            .getOne();
        console.log('movingInfo:::', movingInfo)

        return { "movingInfo" : movingInfo };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async submitNegoCost(movingInfoId, bp) {

    }
}
