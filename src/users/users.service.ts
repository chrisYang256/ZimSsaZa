import bcrypt from 'bcrypt';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { MovingStatusEnum } from '../common/movingStatus.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateMovingGoodsDto } from '../users/dto/create-movingGoods.dto';
import { PagenationDto } from '../common/dto/pagenation.dto';
import { UserWithoutPasswordDto } from './dto/user-without-password.dto';
import { CreateReviewDto } from './dto/create-review.dto';

import { LoadImages } from '../entities/LoadImages';
import { MovingInformations } from '../entities/MovingInformations';
import { MovingGoods } from '../entities/MovingGoods';
import { AreaCodes } from '../entities/AreaCodes';
import { Negotiations } from '../entities/Negotiations';
import { SystemMessages } from '../entities/SystemMessages';
import { Users } from '../entities/Users';
import { Reviews } from '../entities/Reviews';

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
    private loadImagesRepository: Repository<LoadImages>,
    @InjectRepository(AreaCodes)
    private areaCodesRepository: Repository<AreaCodes>,
    @InjectRepository(SystemMessages)
    private systemMessagesRepository: Repository<SystemMessages>,
    @InjectRepository(Negotiations)
    private negotiationsRepository: Repository<Negotiations>,
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    private connection: Connection,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { name, email, password, phone_number } = createUserDto;
    console.log('name', name);
    const passwordRegex =
      /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    const emailRegex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
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

    if (!emailRegex.test(email)) {
      throw new ForbiddenException('이메일 형식이 올바르지 않습니다.');
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
      return { 'message': '회원 가입 성공', 'statusCode': 201 };
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
        MovingStatusId: MovingStatusEnum.DONE,
      })
      .getOne();
    console.log('checkExPackInProgress:::', checkExPackInProgress);

    if (checkExPackInProgress) {
      throw new ForbiddenException(
        '이사 진행중이거나 만들어진 이삿짐이 존재합니다.',
      );
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
        throw new ForbiddenException('회원 정보를 찾을 수 없습니다.');
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
      console.log('movingInfo:::', movingInfo);

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
        .execute();
      console.log('MovingGoods::;', MovingGoods);

      const results = [];
      for (let i = 0; i < files.length; i++) {
        const result = {
          img_path: files[i].path,
          MovingGoodsId: MovingGoods.identifiers[0].id,
        };
        results.push(result);
      }
      console.log('valuse:::', results);

      await this.loadImagesRepository
        .createQueryBuilder('load_images', queryRunner)
        .insert()
        .into('load_images')
        .values(results)
        .execute();

      await queryRunner.commitTransaction();
      console.log('isTransactionActive-3:::', queryRunner.isTransactionActive);

      return { message: '짐 싸기 완료!', status: 201 };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async removePack(userId: number, movingInfoId: number) {
    try {
      const findMovingInfo = await this.movingInformationsRepository
        .createQueryBuilder('movingInfo')
        .where('id = :movingInfoId', { movingInfoId })
        .andWhere('UserId = :userId', { userId })
        .getOne();
      console.log('findMovingInfo:::', findMovingInfo);

      if (!findMovingInfo) {
        throw new ForbiddenException('이삿짐 정보를 찾을 수 없습니다.');
      }

      // 이삿짐 정보 삭제는 movingStatus가 STAY(견적 제출 전), DONE(이사 완료)인 경우만 가능
      const checkMovingStatus = await this.movingInformationsRepository
        .createQueryBuilder('movingInfo')
        .where('id = :movingInfoId', { movingInfoId })
        .andWhere('MovingStatusId IN (:...ids)', {
          ids: [MovingStatusEnum.NEGO, MovingStatusEnum.PICK],
        })
        .getOne();
      console.log('checkMovingStatus:::', checkMovingStatus);

      if (checkMovingStatus) {
        throw new ForbiddenException(
          '견적을 받는 중이거나 이사중인 경우 삭제할 수 없습니다.',
        );
      }

      await this.movingInformationsRepository
        .createQueryBuilder()
        .delete()
        .from('MovingInformations')
        .where('id = :movingInfoId', { movingInfoId })
        .andWhere('UserId = :userId', { userId })
        .execute();

      return { message: '삭제 성공!', status: 201 };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getContract(userId: number) {
    try {
      const myMovingInfo = await this.movingInformationsRepository
        .createQueryBuilder('movingInfo')
        .select([
          'movingInfo.id',
          'movingInfo.destination',
          'movingInfo.start_point',
          'movingInfo.move_date',
          'movingInfo.move_time',
          'movingInfo.picked_business_person',
        ])
        .where('movingInfo.UserId = :userId', { userId })
        .andWhere('movingInfo.MovingStatusId IN (:...ids)', {
          ids: [MovingStatusEnum.PICK],
        })
        .getOne();
      console.log('myMovingInfo:::', myMovingInfo);

      if (!myMovingInfo) {
        throw new NotFoundException('예약중인 이사가 존재하지 않습니다.');
      }

      const myMovingPartner = await this.negotiationsRepository
        .createQueryBuilder('nego')
        .innerJoin('nego.BusinessPerson', 'businessPerson')
        .innerJoin('businessPerson.Reviews', 'reviews')
        .select('nego.cost')
        .addSelect([
          'businessPerson.id',
          'businessPerson.name',
          'businessPerson.phone_number',
        ])
        .addSelect(['reviews.star', 'reviews.writer', 'reviews.content'])
        .where('nego.MovingInformationId = :movingInfoId', {
          movingInfoId: myMovingInfo.id,
        })
        .andWhere('nego.BusinessPersonId = :id', {
          id: myMovingInfo.picked_business_person,
        })
        .getOne();
      console.log('myMovingPartner:::', myMovingPartner);

      if (!myMovingPartner) {
        throw new NotFoundException('해당 기사님이 존재하지 않습니다');
      }

      let stars = 0;
      for (let i = 0; i < myMovingPartner.BusinessPerson.Reviews.length; i++) {
        const star = myMovingPartner.BusinessPerson.Reviews[i].star;
        console.log('star', star);
        stars += star;
      }
      myMovingInfo['starsAvg'] =
        Math.round(
          (stars / myMovingPartner.BusinessPerson.Reviews.length) * 10,
        ) / 10;

      const results = Object.assign(myMovingInfo, myMovingPartner);
      delete results.id;
      delete results.picked_business_person;
      console.log('results:::', results);

      return { message: '계약 완료!', status: 201 };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async writeReview(
    user: UserWithoutPasswordDto,
    businessPersonId: number,
    movingInfoId: number,
    data: CreateReviewDto,
  ) {
    const { content, star } = data;
    try {
      const checkMovingDone = await this.movingInformationsRepository
        .createQueryBuilder('movingInfo')
        .where('movingInfo.id = :id', {
          id: movingInfoId,
        })
        .getOne();

      if (checkMovingDone.MovingStatusId !== MovingStatusEnum.DONE) {
        throw new ForbiddenException('이사가 완료되지 않았습니다.');
      }

      // 리뷰는 이사 1건당 1개로 제한
      const beWritten = await this.reviewsRepository
        .createQueryBuilder('review')
        .where('moving_information_id = :MIId', {
          MIId: movingInfoId,
        })
        .andWhere('UserId = :userId', { userId: user.id })
        .getOne();
      console.log('beWritten:::', beWritten);

      if (beWritten) {
        throw new ForbiddenException('이미 리뷰를 작성하셨습니다.');
      }

      await this.reviewsRepository
        .createQueryBuilder()
        .insert()
        .into('Reviews')
        .values({
          writer: user.name,
          content: content,
          star: star,
          moving_information_id: movingInfoId,
          UserId: user.id,
          BusinessPersonId: businessPersonId,
        })
        .execute();

      return { message: '리뷰 작성 완료!', status: 201 };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async readMessage(userId: number, pagenation: PagenationDto) {
    try {
      const { perPage, page } = pagenation;

      const messages = await this.systemMessagesRepository
        .createQueryBuilder('message')
        .select(['message.message', 'message.createdAt'])
        .where('message.UserId = :userId', { userId })
        .orderBy('message.createdAt', 'DESC')
        .take(perPage)
        .skip(perPage * (page - 1))
        .getMany();
      console.log('my messages:::', messages.length);

      if (messages.length === 0) {
        return { message: '받은 메시지가 없습니다.', status: 200 };
      }

      // unread 카운팅을 위한 기준점 생성
      // page 2 이상의 메시지 리스트를 확인할 시점에 들어온 새로운 메시지는
      // 클라이언트가 사실상 메시지를 확인한 상태가 아니기 때문에 page가 1인 경우만 업데이트 시간 변경
      if (+page === 1) {
        await this.systemMessagesRepository
          .createQueryBuilder()
          .update('system_messages')
          .set({
            updatedAt: new Date(),
          })
          .where('UserId = :userId', { userId })
          .orderBy('updatedAt', 'DESC')
          .limit(1)
          .execute();
      }

      return { messages: messages, 'status': 201 };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async unreadCount(userId: number) {
    try {
      const checkLastDate = await this.systemMessagesRepository
        .createQueryBuilder('message')
        .select(
          'MAX(CONVERT_TZ(message.updatedAt, "+0:00", "+9:00"))',
          'lastReadAt',
        )
        .where('message.UserId = :userId', { userId })
        .getRawOne();
      // console.log(
      //   'lastcheckDate:::',
      //   checkLastDate.lastReadAt.toLocaleString('ko-KR', {
      //     timeZone: 'Asia/Seoul',
      //   }),
      // );

      if (checkLastDate.length === 0) {
        return;
      }

      // readMessage에서 입력한 시점을 기준으로 이후 받은 메시지만 count
      const count = await this.systemMessagesRepository
        .createQueryBuilder('message')
        .where('message.UserId = :userId', { userId })
        .andWhere('message.createdAt > :lastReadAt', {
          lastReadAt: checkLastDate.lastReadAt,
        })
        .getCount();
      console.log('count:::', count);

      return { count: count, 'status:': 200 };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
