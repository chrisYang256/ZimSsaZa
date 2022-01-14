import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Connection, Repository } from 'typeorm';
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
        myId: number,
    ) {
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

        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id: myId })
            .getOne();

        if (!user) {
            throw new ForbiddenException('회원 정보를 찾을 수 없습니다.')
        }

        console.log('isTransactionActive-1:::', queryRunner.isTransactionActive);
        await queryRunner.startTransaction();
        console.log('isTransactionActive-2:::', queryRunner.isTransactionActive);
        try {
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
            // console.log('movingInfo::;', movingInfo)
    
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
            // console.log('MovingGoods::;', MovingGoods)
            
            for (let i = 0; i < files.length; i++) {
                await this.loadImageRepository
                    .createQueryBuilder('load_images', queryRunner)
                    .insert()
                    .into('load_images')
                    .values({
                        img_path: files[i].path,
                        MovingGoodsId: MovingGoods.identifiers[0].id,
                    })
                    .execute();
            }

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


}