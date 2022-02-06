import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { BusinessPersonsService } from './business-persons.service';
import { AreaCodes } from '../entities/AreaCodes';
import { BusinessPersons } from '../entities/BusinessPersons';
import { MovingInformations } from '../entities/MovingInformations';
import { Reviews } from '../entities/Reviews';
import { SystemMessages } from '../entities/SystemMessages';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockConnection = () => ({
  transaction: jest.fn(),
  createQueryRunner: () => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  }),
});

export class MockBusinessPersonsRepository {}
export class MockAreaCodesRepository {}
export class MockSystemMessagesRepository {}
export class MockMovingInformationsRepository {}
export class MockReviewsRepository {}

describe('BusinessPersonsService', () => {
  let service: BusinessPersonsService;
  let mockBusinessPersonsRepository: Repository<BusinessPersons>;
  let mockAreaCodesRepository: Repository<AreaCodes>;
  let mockSystemMessagesRepository: Repository<SystemMessages>;
  let mockMovingInformationsRepository: Repository<MovingInformations>;
  let mockReviewsRepository: Repository<Reviews>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessPersonsService,
        {
          provide: Connection,
          useFactory: mockConnection,
        },
        {
          provide: getRepositoryToken(BusinessPersons),
          useClass: MockBusinessPersonsRepository,
        },
        {
          provide: getRepositoryToken(AreaCodes),
          useClass: MockAreaCodesRepository,
        },
        {
          provide: getRepositoryToken(SystemMessages),
          useClass: MockSystemMessagesRepository,
        },
        {
          provide: getRepositoryToken(MovingInformations),
          useClass: MockMovingInformationsRepository,
        },
        {
          provide: getRepositoryToken(Reviews),
          useClass: MockReviewsRepository,
        },
      ],
    }).compile();

    service = module.get<BusinessPersonsService>(BusinessPersonsService);
    mockBusinessPersonsRepository = module.get(getRepositoryToken(BusinessPersons));
    mockAreaCodesRepository = module.get(getRepositoryToken(AreaCodes));
    mockSystemMessagesRepository = module.get(getRepositoryToken(SystemMessages));
    mockMovingInformationsRepository = module.get(getRepositoryToken(MovingInformations));
    mockReviewsRepository = module.get(getRepositoryToken(Reviews));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('businessPersonInfo success', async () => {
    mockReviewsRepository.createQueryBuilder = jest.fn(() =>({
      select() {
        return this;
      },
      where() {
        return this;
      },
      getMany() {
        return [
          {
            writer: "박효신1",
            content: "정말 좋으신 기사님!!",
            star: 5
          },
          {
            writer: "박효신2",
            content: "덕분에 이사 잘 마무리했슴다^^",
            star: 4
          },
          {
            writer: "박효신3",
            content: "리뷰 보고 기대했는데..안좋은 일 있으셨나봐요..",
            star: 2
          }
        ]
      }
    })) as any;

    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() =>({
      select() {
        return this;
      },
      innerJoin() {
        return this;
      },
      addSelect() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getMany() {
        return [
          {
            start_point: "서울 특별시 동대문구0",
            destination: "서울 특별시 서대문구0",
            move_date: "2021-12-10",
            Negotiations: [{ cost: 200000 }]
          },
          {
            start_point: "서울 특별시 동대문구1",
            destination: "서울 특별시 서대문구2",
            move_date: "2021-12-11",
            Negotiations: [{ cost: 300000 }]
          },
        ]
      }
    })) as any;

    const myInfo = {
      id: 10,
      email: 'zimssaza@gmail.com',
      name: '정의의 기사님',
      phone_number: '010-9876-5432',
      business_license: '123-45-67890',
      finish_count: 100,
      AreaCodes: [ { code: 1 }, { code: 3 }, { code: 5 } ]
    }

    expect(await service.businessPersonInfo(myInfo)).toStrictEqual({ 
      myInfo: myInfo, status: 200 
    });
  });

  it('signUp success', async () => {
    const mock = mockBusinessPersonsRepository.createQueryBuilder = jest.fn(() => ({})) as any;
    mock.mockReturnValueOnce({
      where() {
        return this;
      },
      getOne() {
        return null;
      },
    });

    mock.mockReturnValueOnce({
      where() {
        return this;
      },
      getOne() {
        return null
      },
    });

    mock.mockReturnValueOnce({
      where() {
        return this;
      },
      insert() {
        return this;
      },
      into() {
        return this;
      },
      values() {
        return this;
      },
      execute() {
        return { identifiers: [{ id: 1 }] };
      },
    });

    mockAreaCodesRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      insert() {
        return this;
      },
      into() {
        return this;
      },
      values() {
        return this;
      },
      execute() {
        return { raw: { affectedRows: 1 } };
      },
    })) as any;

    const value = {
      name: '정의의 기사님',
      email: 'zimssaza@gmail.com',
      phone_number: '010-0000-0000',
      password: '1234abcd!',
      business_license: '123-45-67890',
      code: [1, 4, 5],
    };
    expect(await service.signUp(value)).toStrictEqual({
      message: '회원 가입 성공', status: 201,
    });
  });

  it('signUp fail by invalid email format', () => {
    const value = {
      name: '정의의 기사님',
      email: 'zimssazagmail.com',
      phone_number: '010-0000-0000',
      password: '1234abcd!',
      business_license: '123-45-67890',
      code: [1, 4, 5],
    };
    expect(service.signUp(value)).rejects.toThrow(
      new ForbiddenException('이메일 형식이 올바르지 않습니다.')
    );
  });

  it('signUp fail by duplicate businessPerson license', () => {
    mockBusinessPersonsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return { business_license: '123-45-67890' };
      },
    })) as any;

    const value = {
      name: '정의의 기사님',
      email: 'zimssaza@gmail.com',
      phone_number: '010-0000-0000',
      password: '1234abcd!',
      business_license: '123-45-67890',
      code: [1, 4, 5],
    };
    expect(service.signUp(value)).rejects.toThrow(
      new ForbiddenException(`'${value.business_license}'는 이미 가입된 사업자번호입니다.`)
    );
  });  

  it('getScheduleList success', async () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      select() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      orderBy() {
        return this;
      },
      getMany() {
        return [
          {
            "id": 5,
            "start_point": "서울 특별시 중구",
            "destination": "서울 특별시 동작구",
            "move_date": "2021-12-30",
            "move_time": "13:30"
          },
          {
            "id": 12,
            "start_point": "서울 특별시 강서구",
            "destination": "서울 특별시 서초구",
            "move_date": "2022-01-11",
            "move_time": "14:00"
          },
        ];
      },
    })) as any;

    expect(await service.getScheduleList(3)).toStrictEqual({
      schedules: [
        {
          "id": 5,
          "start_point": "서울 특별시 중구",
          "destination": "서울 특별시 동작구",
          "move_date": "2021-12-30",
          "move_time": "13:30"
        },
        {
          "id": 12,
          "start_point": "서울 특별시 강서구",
          "destination": "서울 특별시 서초구",
          "move_date": "2022-01-11",
          "move_time": "14:00"
        },
      ], status: 200
    });
  });

  it('getScheduleList success in case schedules.length id 0', async () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      select() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      orderBy() {
        return this;
      },
      getMany() {
        return [];
      },
    })) as any;

    expect(await service.getScheduleList(3)).toStrictEqual({
      message: '예약중인 일정이 없습니다.', status: 200
    });
  });

  it('getScheduleDetail success', async () => {
    const movingInfo = {
      "start_point": "서울 특별시 중구",
      "destination": "서울 특별시 동작구",
      "move_date": "2021-12-30",
      "move_time": "13:30",
      "user_done": 0,
      "business_person_done": 0,
      "MovingGoods": {
        "bed": 2,
        "closet": 1,
        "storage_closet": 1,
        "table": 2,
        "sofa": 1,
        "box": 10,
        "LoadImages": [
          {
            "img_path": "img-uploads/screenshot 2022-01-20 오후 5.33.571643022329063_load.png"
          },
          {
            "img_path": "img-uploads/screenshot 2022-01-17 오후 2.17.441643022329066_load.png"
          }
        ]
      },
      "Negotiations": [
        {
          "cost": 200000
        }
      ],
      "User": {
        "name": "브래드 피트",
        "phone_number": "010-1234-5678"
      }
    }
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      innerJoin() {
        return this;
      },
      select() {
        return this;
      },
      addSelect() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return movingInfo;
      },
    })) as any;

    expect(await service.getScheduleDetail(10, 5)).toStrictEqual({
        movingInfo: movingInfo, status: 200
    });
  });

  it('getScheduleDetail fail by not found movingInfo', () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      innerJoin() {
        return this;
      },
      select() {
        return this;
      },
      addSelect() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return null;
      },
    })) as any;

    expect(service.getScheduleDetail(10, 5)).rejects.toThrow(
      new NotFoundException('이사 정보가 존재하지 않습니다.')
    );
  });

  it('readMessage success', async () => {
    mockSystemMessagesRepository.createQueryBuilder = jest.fn(() => ({
      select() {
        return this;
      },
      where() {
        return this;
      },
      take() {
        return this;
      },
      skip() {
        return this;
      },
      orderBy() {
        return this;
      },
      getMany() {
        return [
          { 
            message: 'system message1', 
            createdAt: '2022-01-30 19:06:04.268965'
          },
          { 
            message: 'system message2', 
            createdAt: '2022-01-31 19:06:04.268965'
          },
        ];
      },
      update() {
        return this;
      },
      set() {
        return this;
      },
      limit() {
        return this;
      },
      execute() {
        return this;
      },
    })) as any;

    const pagenation = { page: 1, perPage: 20 }
    expect(await service.readMessage(1, pagenation)).toStrictEqual({ 
      messages: [
        { 
          message: 'system message1', 
          createdAt: '2022-01-30 19:06:04.268965'
        },
        { 
          message: 'system message2', 
          createdAt: '2022-01-31 19:06:04.268965'
        },
      ],
      status: 201
    });
  });

  it('readMessage success in case message count is 0', async () => {
    mockSystemMessagesRepository.createQueryBuilder = jest.fn(() => ({
      select() {
        return this;
      },
      where() {
        return this;
      },
      take() {
        return this;
      },
      skip() {
        return this;
      },
      orderBy() {
        return this;
      },
      getMany() {
        return [];
      },
    })) as any;

    const pagenation = { page: 1, perPage: 20 }
    expect(await service.readMessage(1, pagenation)).toStrictEqual({
      message: '받은 메시지가 없습니다.', status: 200
    });
  });

  it('unreadCount success', async () => {
    const checkLastDate = mockSystemMessagesRepository.createQueryBuilder = jest.fn(() => ({
      select() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getRawOne() {
        return { lastReadAt: '2022-01-30 19:06:04.268965' };
      },
      getCount() {
        return 3;
      },
    })) as any;

    expect(await service.unreadCount(1)).toStrictEqual({
      count: 3, 'status:': 200
    });
  });

  it('unreadCount just return by messages length is 0', async () => {
    mockSystemMessagesRepository.createQueryBuilder = jest.fn(() => ({
      select() {
        return this;
      },
      where() {
        return this;
      },
      getRawOne() {
        return [];
      },
    })) as any;

    expect(await service.unreadCount(1)).toBeUndefined();
  });
});
