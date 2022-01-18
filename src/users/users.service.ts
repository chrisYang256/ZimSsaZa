import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Connection, createQueryBuilder, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { CreateMovingGoodsDto } from 'src/users/dto/create-movingGoods.dto';
import { MovingInformations } from 'src/entities/MovingInformations';
import { MovingGoods } from 'src/entities/MovingGoods';
import { LoadImages } from 'src/entities/LoadImages';
import { AreaCodes } from 'src/entities/AreaCodes';
import { MovingStatusEnum } from 'src/common/movingStatus.enum';

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

    async removePack(userId, packId) {
        // 이삿짐 삭제는 NEGO 이상 진행중이지 않은 경우만 가능
        const checkMovingStatus = await this.movingInformationsRepository
            .createQueryBuilder('movingInfo')
            .where('id = :packId', { packId })
            .andWhere('MovingStatusId IN (:...ids)', { ids: [
                MovingStatusEnum.NEGO,
                MovingStatusEnum.PICK,
                MovingStatusEnum.DONE,
            ]})
            .getOne();
        console.log('checkMovingStatus:::', checkMovingStatus);

        if (checkMovingStatus) {
            throw new ForbiddenException('견적받기 이상 진행 중인 이삿짐 정보는 삭제할 수 없습니다.');
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
}