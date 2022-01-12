import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoveStatusEnum } from 'src/common/moveStatus.enum';
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
                .innerJoin('movingInfo.MovingStatus', 'ms')
                .where('movingInfo.UserId', { id: myId })
                .getMany();
            // console.log('isSubmitting:::', isSubmitting)
    
            if (isSubmitting.find((v) => v.MovingStatusId === MoveStatusEnum.nego)) { // 견적 장난질 방지
                throw new ForbiddenException('이미 견적을 받고 있는 이삿짐이 존재합니다.')
            }
    
            // 견적은 가장 최근 기록된 이사 정보만 제출할 수 있도록 함
            // 여러개의 견적을 볼 필요도 없고 악용될 수도 있기 때문
            const movingInfo = await this.movingInformationsRepository
                .createQueryBuilder('movingInfo')
                .select([
                    'movingInfo.id',
                    'movingInfo.start_point',
                    'movingInfo.destination',
                    'movingInfo.move_date',
                    'movingInfo.move_time',
                ])
                .addSelect('areacode.code')
                .addSelect([
                    'goods.bed', 
                    'goods.closet',
                    'goods.storage_closet',
                    'goods.table',
                    'goods.sofa',
                    'goods.box',
                ])
                .innerJoin('movingInfo.AreaCode', 'areacode')
                .innerJoin('movingInfo.MovingGoods', 'goods')
                .innerJoin('goods.LoadImags', 'images')
                .where('movingInfo.UserId = :id', { id: myId })
                .orderBy('movingInfo.createdAt', "DESC")
                .getOne();
            // console.log('movingInfo:::', movingInfo)
    
            // 24시간 동안 견적을 받을 수 있기 때문에 견적서 제출 시간을 기록
            await this.movingInformationsRepository
            .createQueryBuilder()
            .update('moving_informations')
            .set({ submit: new Date() })
            .where('id = :id', { id: movingInfo.id })
            .execute();
    
            return { "movingInfo" : movingInfo };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
