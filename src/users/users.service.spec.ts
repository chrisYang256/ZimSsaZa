import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, QueryBuilder, Repository } from 'typeorm';

// import { JwtService } from '@nestjs/jwt';
// jest.mock('JwtService')

import { UsersService } from './users.service';
import { Users } from '../entities/Users';
import { MovingInformations } from '../entities/MovingInformations';
import { MovingGoods } from '../entities/MovingGoods';
import { LoadImages } from '../entities/LoadImages';
import { AreaCodes } from '../entities/AreaCodes';
import { SystemMessages } from '../entities/SystemMessages';
import { Negotiations } from '../entities/Negotiations';
import { Reviews } from '../entities/Reviews';
import { CanActivate, ExecutionContext } from '@nestjs/common';

export class MockUsersRepository {}
export class MockMovingInformationsRepository {}
export class MockMovingGoodsRepository {}
export class MockLoadImagesRepository {}
export class MockAreaCodesRepository {}
export class MockSystemMessagesRepository {}
export class MockNegotiationsRepository {}
export class MockReviewsRepository {}

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

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: Repository<Users>;
  let mockMovingInformationsRepository: Repository<MovingInformations>;
  let mockMovingGoodsRepository: Repository<MovingGoods>;
  let mockLoadImagesRepository: Repository<LoadImages>;
  let mockAreaCodesRepository: Repository<AreaCodes>;
  let mockSystemMessagesRepository: Repository<SystemMessages>;
  let mockNegotiationsRepository: Repository<Negotiations>;
  let mockReviewsRepository: Repository<Reviews>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: Connection,
          useFactory: mockConnection,
        },
        {
          provide: getRepositoryToken(Users),
          useClass: MockUsersRepository,
        },
        {
          provide: getRepositoryToken(MovingInformations),
          useClass: MockMovingInformationsRepository,
        },
        {
          provide: getRepositoryToken(MovingGoods),
          useClass: MockMovingGoodsRepository,
        },
        {
          provide: getRepositoryToken(LoadImages),
          useClass: MockLoadImagesRepository,
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
          provide: getRepositoryToken(Negotiations),
          useClass: MockNegotiationsRepository,
        },
        {
          provide: getRepositoryToken(Reviews),
          useClass: MockReviewsRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    // connection = await module.get<Connection>(Connection);
    mockUsersRepository = module.get(getRepositoryToken(Users));
    mockMovingInformationsRepository = module.get(
      getRepositoryToken(MovingInformations),
    );
    mockMovingGoodsRepository = module.get(getRepositoryToken(MovingGoods));
    mockLoadImagesRepository = module.get(getRepositoryToken(LoadImages));
    mockAreaCodesRepository = module.get(getRepositoryToken(AreaCodes));
    mockSystemMessagesRepository = module.get(
      getRepositoryToken(SystemMessages),
    );
    mockNegotiationsRepository = module.get(getRepositoryToken(Negotiations));
    mockReviewsRepository = module.get(getRepositoryToken(Reviews));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signUp success', async () => {
    mockUsersRepository.createQueryBuilder = jest.fn(() => ({
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
        return { raw: { affectedRows: 1 } }
      },
      getOne() {
        return null;
      }
    })) as any;

    const value = {
      name: "브래드 피트",
      email: "zimssaza123@gmail.com",
      phone_number: "010-0000-0000",
      password: "1234abcd!",
    };
    expect(await service.signUp(value))
      .toStrictEqual({ raw: { affectedRows: 1 } });
  });

  // it('makePackForMoving success', async () => {
  //   mockUsersRepository.createQueryBuilder = jest.fn(() => ({
  //     insert() {
  //       return this;
  //     },
  //     into() {
  //       return this;
  //     },
  //     values() {
  //       return this;
  //     },
  //     execute() {
  //       return { raw: { affectedRows: 2 } };
  //     },
  //   })) as any;

  //   const values = {
  //     start_point: '서울 특별시 중구',
  //     destination: '서울 특별시 동작구',
  //     move_date: '2021-12-30',
  //     move_time: '15:30',
  //     bed: 1,
  //     closet: 1,
  //     storage_closet: 1,
  //     table: 1,
  //     sofa: 1,
  //     box: 2,
  //     code: 1,
  //     img_path: null,
  //   };
  //   // jest.spyOn(queryRunner.manager, 'save').mockResolvedValueOnce(values);
  //   expect(await service.makePackForMoving(values, [], 1)).toEqual({
  //     affectedRows: 2,
  //   });
  //   expect(mockMovingInformationsRepository.save).toHaveBeenCalledTimes(1);
  //   expect(mockMovingGoodsRepository.save).toHaveBeenCalledTimes(1);
  // });
});
