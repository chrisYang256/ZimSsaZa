import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';

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
        return { raw: { affectedRows: 1 } };
      },
      getOne() {
        return null;
      },
    })) as any;

    const value = {
      name: '브래드 피트',
      email: 'zimssaza123@gmail.com',
      phone_number: '010-0000-0000',
      password: '1234abcd!',
    };
    expect(await service.signUp(value)).toStrictEqual({
      'message': '회원 가입 성공', 'statusCode': 200,
    });
  });

  it('signUp fail by invalid email format', () => {
    const value = {
      name: '브래드 피트',
      email: 'zimssaza123gmail.com',
      phone_number: '010-0000-0000',
      password: '1234abcd!',
    };
    expect(service.signUp(value)).rejects.toThrow(
      new ForbiddenException('이메일 형식이 올바르지 않습니다.')
    );
  });

  it('signUp fail by duplicate user email', () => {
    mockUsersRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return this;
      },
    })) as any;

    const value = {
      name: '브래드 피트',
      email: 'zimssaza123@gmail.com',
      phone_number: '010-0000-0000',
      password: '1234abcd!',
    };
    expect(service.signUp(value)).rejects.toThrow(
      new ForbiddenException(`'${value.email}'는 이미 가입된 이메일입니다.`)
    );
  });

  it('makePackForMoving success', async () => {
    mockUsersRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return this;
      },
    })) as any;

    const movingInfo = mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      andWhere() {
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
      getOne() {
        return null;
      },
    })) as any;

    mockAreaCodesRepository.createQueryBuilder = jest.fn(() => ({
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

    mockMovingGoodsRepository.createQueryBuilder = jest.fn(() => ({
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

    mockLoadImagesRepository.createQueryBuilder = jest.fn(() => ({
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
        return { raw: { affectedRows: 0 } };
      },
    })) as any;

    const values = {
      start_point: '서울 특별시 중구',
      destination: '서울 특별시 동작구',
      move_date: '2021-12-30',
      move_time: '15:30',
      bed: 1,
      closet: 1,
      storage_closet: 1,
      table: 1,
      sofa: 1,
      box: 2,
      code: 1,
      img_path: null,
    };
    expect(await service.makePackForMoving(values, [], 1)).toStrictEqual({
      message: '짐 싸기 완료!', status: 201,
    });  
  });

  it('makePackForMoving fail by exist already packing', () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return {};
      },
    })) as any;

    const values = {
      start_point: '서울 특별시 중구',
      destination: '서울 특별시 동작구',
      move_date: '2021-12-30',
      move_time: '15:30',
      bed: 1,
      closet: 1,
      storage_closet: 1,
      table: 1,
      sofa: 1,
      box: 2,
      code: 1,
      img_path: null,
    }
    expect(service.makePackForMoving(values, [], 1)).rejects.toThrow(
      new ForbiddenException(
        '이사 진행중이거나 만들어진 이삿짐이 존재합니다.'
      )
    );  
  });

  it('makePackForMoving fail by not exist user', () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
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

    mockUsersRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return null;
      },
    })) as any;

    const values = {
      start_point: '서울 특별시 중구',
      destination: '서울 특별시 동작구',
      move_date: '2021-12-30',
      move_time: '15:30',
      bed: 1,
      closet: 1,
      storage_closet: 1,
      table: 1,
      sofa: 1,
      box: 2,
      code: 1,
      img_path: null,
    }
    expect(service.makePackForMoving(values, [], 3)).rejects.toThrow(
      new ForbiddenException('회원 정보를 찾을 수 없습니다.')
    );  
  });

  it('removePack success', async () => {
    const mock = mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      delete() {
        return this;
      },
      from() {
        return this;
      },
      andWhere() {
        return this;
      },
      execute() {
        return this;
      },
      getOne() {
        mock.mockReturnValueOnce({id:1}).mockReturnValueOnce(null);
      }
    })) as any;

    expect(await service.removePack(1, 2)).toStrictEqual({ 
      message: '삭제 성공!', status: 201
    });  
  });
});
