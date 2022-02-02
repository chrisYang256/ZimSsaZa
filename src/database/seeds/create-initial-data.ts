import bcrypt from 'bcrypt';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { MovingStatuses } from '../../entities/MovingStatuses';
import { Users } from '../../entities/Users';
import { MovingInformations } from '../../entities/MovingInformations';
import { MovingGoods } from '../../entities/MovingGoods';
import { LoadImages } from '../../entities/LoadImages';
import { AreaCodes } from '../../entities/AreaCodes';
import { BusinessPersons } from '../../entities/BusinessPersons';
import { Negotiations } from '../../entities/Negotiations';
import { Reviews } from '../../entities/Reviews';

export class CreateInitialData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('1234abcd!', salt);

    await connection
      .createQueryBuilder()
      .insert()
      .into(MovingStatuses)
      .values([
        { id: 1, status: 'STAY' },
        { id: 2, status: 'NEGO' },
        { id: 3, status: 'PICK' },
        { id: 4, status: 'DONE' },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values({
        id: 1,
        email: 'zimssaza@gmail.com',
        name: '브래드 피트',
        phone_number: '010-1234-5678',
        password: hashedPassword,
      })
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(MovingInformations)
      .values({
        id: 5,
        start_point: '서울 특별시 중구',
        destination: '서울 특별시 동작구',
        move_date: '2021-12-30',
        move_time: '13:30',
        picked_business_person: null,
        user_done: false,
        business_person_done: false,
        UserId: 1,
        MovingStatusId: 2,
      })
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(AreaCodes)
      .values({
        id: 1,
        code: 1,
        MovingInformationId: 5,
      })
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(MovingGoods)
      .values({
        id: 1,
        bed: 2,
        closet: 1,
        storage_closet: 1,
        table: 2,
        sofa: 1,
        box: 10,
        MovingInformationId: 5,
      })
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(LoadImages)
      .values([
        {
          id: 1,
          img_path:
            'img-uploads/screenshot 2022-01-20 오후 5.33.571643022329063_load.png',
          MovingGoodsId: 1,
        },
        {
          id: 2,
          img_path:
            'img-uploads/screenshot 2022-01-17 오후 2.17.441643022329066_load.png',
          MovingGoodsId: 1,
        },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Negotiations)
      .values({
        id: 1,
        MovingInformationId: 5,
      })
      .execute();

    // mock users data
    const users = [];
    for (let i = 1; i < 6; i++) {
      users.push({
        id: i + 1,
        email: i + 'ssazim@naver.com',
        name: '박효신' + i,
        phone_number: '010-0000-000' + i,
        password: hashedPassword,
      });
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values(users)
      .execute();

    const movingDone = [];
    for (let i = 0; i < 4; i++) {
      movingDone.push({
        id: 1 + i,
        start_point: '서울 특별시 동대문구' + i,
        destination: '서울 특별시 서대문구' + i,
        move_date: '2021-12-1' + i,
        move_time: '13:30',
        picked_business_person: 10,
        user_done: 1,
        business_person_done: 1,
        UserId: 2 + i,
        MovingStatusId: 4,
      });
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(MovingInformations)
      .values(movingDone)
      .execute();

    // mock businessPersons data
    const businessPersons = [];
    for (let i = 1; i < 10; i++) {
      businessPersons.push({
        id: i,
        email: i + 'ssazim-knight@naver.com.com',
        name: '기사님' + i,
        phone_number: '010-000-0000',
        password: hashedPassword,
        business_license: '123-45-6789' + i,
        finish_count: 10,
      });
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(BusinessPersons)
      .values(businessPersons)
      .execute();

    const areacodes = [];
    let areacodesId = 1;
    let areacodesBusinessPersonId = 0;
    for (let i = 0; i < 9; i++) {
      areacodesBusinessPersonId += 1;
      for (let j = 0; j < 3; j++) {
        areacodesId += 1;
        areacodes.push({
          id: areacodesId,
          code: 1 + j,
          BusinessPersonId: areacodesBusinessPersonId,
        });
      }
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(AreaCodes)
      .values(areacodes)
      .execute();

    const estimates = [];
    const getCost = () => {
      const cost = Math.ceil(Math.random() * 100) * 10000;
      if (cost < 200000 || cost > 500000) {
        return getCost();
      }
      return cost;
    };
    for (let i = 1; i < 10; i++) {
      estimates.push({
        id: i + 1,
        cost: getCost(),
        MovingInformationId: 5,
        BusinessPersonId: i,
      });
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(Negotiations)
      .values(estimates)
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(BusinessPersons)
      .values({
        id: 10,
        name: '정의의 기사님',
        email: 'zimssaza@gmail.com',
        password: hashedPassword,
        phone_number: '010-9876-5432',
        business_license: '123-45-67890',
        finish_count: 4,
      })
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(AreaCodes)
      .values([
        {
          id: 29,
          code: 1,
          BusinessPersonId: 10,
        },
        {
          id: 30,
          code: 3,
          BusinessPersonId: 10,
        },
        {
          id: 31,
          code: 5,
          BusinessPersonId: 10,
        },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Reviews)
      .values([
        {
          id: 1,
          writer: '박효신1',
          content: '정말 좋으신 기사님!!',
          star: 5,
          UserId: 2,
          moving_information_id: 1,
          BusinessPersonId: 10,
        },
        {
          id: 2,
          writer: '박효신2',
          content: '덕분에 이사 잘 마무리했슴다^^',
          star: 4,
          UserId: 3,
          moving_information_id: 2,
          BusinessPersonId: 10,
        },
        {
          id: 3,
          writer: '박효신3',
          content: '리뷰 보고 기대했는데..안좋은 일 있으셨나봐요..',
          star: 2,
          UserId: 4,
          moving_information_id: 3,
          BusinessPersonId: 10,
        },
      ])
      .execute();
  }
}
