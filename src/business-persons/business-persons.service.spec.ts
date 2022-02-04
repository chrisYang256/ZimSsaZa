import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { BusinessPersonsService } from './business-persons.service';
import { AreaCodes } from '../entities/AreaCodes';
import { BusinessPersons } from '../entities/BusinessPersons';
import { MovingInformations } from '../entities/MovingInformations';
import { Reviews } from '../entities/Reviews';
import { SystemMessages } from '../entities/SystemMessages';

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
  let mockBusinessPersons: Repository<BusinessPersons>;
  let mockAreaCodes: Repository<AreaCodes>;
  let mockSystemMessages: Repository<SystemMessages>;
  let mockMovingInformations: Repository<MovingInformations>;
  let mockReviews: Repository<Reviews>;

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
    mockBusinessPersons = module.get(getRepositoryToken(BusinessPersons));
    mockAreaCodes = module.get(getRepositoryToken(AreaCodes));
    mockSystemMessages = module.get(getRepositoryToken(SystemMessages));
    mockMovingInformations = module.get(getRepositoryToken(MovingInformations));
    mockReviews = module.get(getRepositoryToken(Reviews));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('businessPersonInfo success', async () => {
    mockReviews.createQueryBuilder = jest.fn(() =>({
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

    mockMovingInformations.createQueryBuilder = jest.fn(() =>({
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
});
