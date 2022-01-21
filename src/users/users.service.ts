import bcrypt from 'bcrypt';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateMovingGoodsDto } from 'src/users/dto/create-movingGoods.dto';
import { MovingInformations } from 'src/entities/MovingInformations';
import { MovingGoods } from 'src/entities/MovingGoods';
import { LoadImages } from 'src/entities/LoadImages';
import { AreaCodes } from 'src/entities/AreaCodes';
import { MovingStatusEnum } from 'src/common/movingStatus.enum';
import { SystemMessages } from 'src/entities/SystemMessages';
import { PagenationDto } from 'src/common/dto/pagenation.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(MovingInformations)
        private movingInformationsRepository: Repository<MovingInformations>,
        @InjectRepository(MovingGoods)
        private movingGoodsRepository: Repository<MovingGoods>,
        @InjectRepository(LoadImages)
        private loadImageRepository: Repository<LoadImages>,
        @InjectRepository(AreaCodes)
        private areaCodesRepository: Repository<AreaCodes>,
        @InjectRepository(SystemMessages)
        private systemMessages: Repository<SystemMessages>,
        private connection: Connection,
    ) {}

    async signUp(createUserDto: CreateUserDto) {
        const { name, email, password, phone_number } = createUserDto;
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
            const user = await this.usersRepository
                .createQueryBuilder('users')
                .where('users.email = :email', { email })
                .getOne();
    
            if (user) {
                throw new ForbiddenException(`'${email}'는 이미 가입된 이메일입니다.`);
            }
    
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
    
            await this.usersRepository
                .createQueryBuilder()
                .insert()
                .into('users')
                .values({ 
                    name, 
                    email, 
                    password: hashedPassword, 
                    phone_number,
                })
                .execute();
            return { 'message': '회원 가입 성공', 'statusCode': 200 };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async makePackForMoving(
        createMovingGoodsDto: CreateMovingGoodsDto, 
        files: Array<Express.Multer.File>, 
        userId: number,
    ) {
        // 이미 등록된 이삿짐이 있고 + 그 이삿짐이 이사완료가 되지 않은 상태라면 재등록 못하도록
        const checkExPackInProgress = await this.movingInformationsRepository 
            .createQueryBuilder('movingInfo')
            .where('movingInfo.UserId = :userId', { userId })
            .andWhere('movingInfo.MovingStatusId != :MovingStatusId', { 
                MovingStatusId: MovingStatusEnum.DONE
            })
            .getOne();
        console.log('checkExPackInProgress:::', checkExPackInProgress)

        if (checkExPackInProgress) {
            throw new ForbiddenException('이사 진행중이거나 만들어진 이삿짐이 존재합니다.')
        }

        const {  
            start_point,  
            destination,
            move_date,
            move_time,
            bed,
            closet,
            storage_closet,
            table,
            sofa,
            box,
            code,
        } = createMovingGoodsDto;

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();

        console.log('isTransactionActive-1:::', queryRunner.isTransactionActive);
        await queryRunner.startTransaction();
        console.log('isTransactionActive-2:::', queryRunner.isTransactionActive);
        try {
            const user = await this.usersRepository
                .createQueryBuilder('user')
                .where('user.id = :id', { id: userId })
                .getOne();

            if (!user) {
                throw new ForbiddenException('회원 정보를 찾을 수 없습니다.')
            }

            const movingInfo = await this.movingInformationsRepository
                .createQueryBuilder('moving_informations', queryRunner)
                .insert()
                .into('moving_informations')
                .values({
                    start_point,
                    destination,
                    move_date,
                    move_time,
                    MovingStatusId: MovingStatusEnum.STAY,
                    UserId: user.id,
                })
                .execute();
            console.log('movingInfo:::', movingInfo)
    
            await this.areaCodesRepository
                .createQueryBuilder('area_codes', queryRunner)
                .insert()
                .into('area_codes')
                .values({
                    code,
                    userId: user.id,
                    MovingInformationId: movingInfo.identifiers[0].id,
                })
                .execute();
    
            const MovingGoods = await this.movingGoodsRepository
                .createQueryBuilder('moving_goods', queryRunner)
                .insert()
                .into('moving_goods')
                .values({
                    bed,
                    closet,
                    storage_closet,
                    table,
                    sofa,
                    box,
                    MovingInformationId: movingInfo.identifiers[0].id,
                })
                .execute()
            console.log('MovingGoods::;', MovingGoods)
            
            let results = [];
            for (let i = 0; i < files.length; i++) {
                const result = { 
                    img_path: files[i].path,
                    MovingGoodsId: MovingGoods.identifiers[0].id,
                }
                results.push(result)
            }
            console.log('valuse:::', results);

            await this.loadImageRepository
            .createQueryBuilder('load_images', queryRunner)
            .insert()
            .into('load_images')
            .values(results)
            .execute();

            await queryRunner.commitTransaction();
            console.log('isTransactionActive-3:::', queryRunner.isTransactionActive);

            return { "message" : "짐 싸기 완료!", "status" : 201 }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async removePack(userId: number, packId: number) {
        const findMovingInfo = await this.movingInformationsRepository
            .createQueryBuilder('movingInfo')
            .where('id = :packId', { packId })
            .andWhere('UserId = :userId', { userId})
            .getOne();
        console.log('findMovingInfo:::', findMovingInfo);
        
        if (!findMovingInfo) {
            throw new ForbiddenException('이삿짐 정보를 찾을 수 없습니다.')
        }

        // 이삿짐 정보 삭제는 movingStatus가 STAY(견적 제출 전), DONE(이사 완료)인 경우만 가능
        const checkMovingStatus = await this.movingInformationsRepository
            .createQueryBuilder('movingInfo')
            .where('id = :packId', { packId })
            .andWhere('MovingStatusId IN (:...ids)', { ids: [
                MovingStatusEnum.NEGO,
                MovingStatusEnum.PICK,
            ]})
            .getOne();
        console.log('checkMovingStatus:::', checkMovingStatus);

        if (checkMovingStatus) {
            throw new ForbiddenException('견적을 받는 중이거나 이사중인 경우 삭제할 수 없습니다.');
        }

        await this.movingInformationsRepository
            .createQueryBuilder()
            .delete()
            .from('MovingInformations')
            .where('id = :packId', { packId })
            .andWhere('UserId = :userId', { userId})
            .execute();
        
        return { 'message' : '삭제 성공!', 'status' : 201 }
    }

    async readMessage(
        userId: number,
        pagenation: PagenationDto
    ) {
        const { perPage, page } = pagenation;

        const messages = await this.systemMessages
            .createQueryBuilder('message')
            .select(['message.message', 'message.createdAt'])
            .where('message.UserId = :userId', { userId })
            .orderBy('message.createdAt', 'DESC')
            .take(perPage)
            .skip(perPage * (page - 1))
            .getMany();
        console.log('my messages:::', messages.length);

        // unread 카운팅을 위한 기준점 생성
        // 메시지가 있고 page가 1인 경우만 업데이트 시간 변경
        // page 2 이상의 메시지 리스트를 확인할 시점에 들어온 새로운 메시지는 
        // 클라이언트가 사실상 메시지를 확인한 상태가 아니기 때문
        if ((messages.length <= 1) && (+page === 1)) {
            await this.systemMessages
                .createQueryBuilder()
                .update('system_messages')
                .set({
                    updatedAt: new Date()
                })
                .where('UserId = :userId', { userId })
                .orderBy('updatedAt', 'DESC')
                .limit(1)
                .execute();
        }

        return { 'message' : messages, 'status:' : 200 }
    }

    async unreadCount(userId: number) {
        const checkLastDate = await this.systemMessages
            .createQueryBuilder('message')
            .select('MAX(CONVERT_TZ(message.updatedAt, "+0:00", "+9:00"))', 'lastReadAt')
            .where('message.UserId = :userId', { userId })
            .getRawOne();
        console.log('lastcheckDate:::', checkLastDate.lastReadAt);
        
        // readMessage에서 입력한 시점을 기준으로 이후 받은 메시지만 출력
        const count = await this.systemMessages
            .createQueryBuilder('message')
            .where('message.UserId = :userId', { userId })
            .andWhere('message.createdAt > :lastReadAt', { 
                lastReadAt: checkLastDate.lastReadAt
            })
            .getCount();
        console.log('count:::', count);

        return { 'count' : count, 'status:' : 200 }
    }
}