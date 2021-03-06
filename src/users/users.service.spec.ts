import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

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
      name: '????????? ??????',
      email: 'zimssaza123@gmail.com',
      phone_number: '010-0000-0000',
      password: '1234abcd!',
    };
    expect(await service.signUp(value)).toStrictEqual({
      message: '?????? ?????? ??????!',
      status: 201,
    });
  });

  it('signUp fail by invalid email format', () => {
    const value = {
      name: '????????? ??????',
      email: 'zimssaza123gmail.com',
      phone_number: '010-0000-0000',
      password: '1234abcd!',
    };
    expect(service.signUp(value)).rejects.toThrow(
      new ForbiddenException('????????? ????????? ???????????? ????????????.'),
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
      name: '????????? ??????',
      email: 'zimssaza123@gmail.com',
      phone_number: '010-0000-0000',
      password: '1234abcd!',
    };
    expect(service.signUp(value)).rejects.toThrow(
      new ForbiddenException(`'${value.email}'??? ?????? ????????? ??????????????????.`),
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

    const movingInfo = (mockMovingInformationsRepository.createQueryBuilder =
      jest.fn(() => ({
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
      })) as any);

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
      start_point: '?????? ????????? ??????',
      destination: '?????? ????????? ?????????',
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
      message: '??? ?????? ??????!',
      status: 201,
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
        return { id: 1 };
      },
    })) as any;

    const values = {
      start_point: '?????? ????????? ??????',
      destination: '?????? ????????? ?????????',
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
    expect(service.makePackForMoving(values, [], 1)).rejects.toThrow(
      new ForbiddenException('?????? ?????????????????? ???????????? ???????????? ???????????????.'),
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
      start_point: '?????? ????????? ??????',
      destination: '?????? ????????? ?????????',
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
    expect(service.makePackForMoving(values, [], 3)).rejects.toThrow(
      new ForbiddenException('?????? ????????? ?????? ??? ????????????.'),
    );
  });

  it('removePack success', async () => {
    const mock = (mockMovingInformationsRepository.createQueryBuilder = jest.fn(
      () => ({
        delete() {
          return this;
        },
        from() {
          return this;
        },
        where() {
          return this;
        },
        andWhere() {
          return this;
        },
        execute() {
          return this;
        },
      }),
    ) as any);

    mock
      .mockReturnValueOnce({
        where() {
          return this;
        },
        andWhere() {
          return this;
        },
        getOne() {
          return { id: 1 };
        },
      })
      .mockReturnValueOnce({
        where() {
          return this;
        },
        andWhere() {
          return this;
        },
        getOne() {
          return null;
        },
      });

    expect(await service.removePack(1, 2)).toStrictEqual({
      message: '?????? ??????!',
      status: 201,
    });
  });

  it('removePack fail by not exist movinginfo', () => {
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

    expect(service.removePack(1, 2)).rejects.toThrow(
      new NotFoundException('????????? ????????? ?????? ??? ????????????.'),
    );
  });

  it('removePack fail by not exist movinginfo', () => {
    const mock = (mockMovingInformationsRepository.createQueryBuilder = jest.fn(
      () => ({}),
    ) as any);
    mock.mockReturnValueOnce({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return { id: 1 };
      },
    });
    mock.mockReturnValueOnce({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return { id: 1 };
      },
    });

    expect(service.removePack(1, 2)).rejects.toThrow(
      new ForbiddenException(
        '????????? ?????? ???????????? ???????????? ?????? ????????? ??? ????????????.',
      ),
    );
  });

  it('getContract success', async () => {
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
      getOne() {
        return {
          start_point: '?????? ????????? ??????',
          destination: '?????? ????????? ?????????',
          move_date: '2021-12-30',
          move_time: '13:30',
          starsAvg: 3.7,
          cost: 200000,
        };
      },
    })) as any;

    mockNegotiationsRepository.createQueryBuilder = jest.fn(() => ({
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
        return {
          BusinessPerson: {
            id: 10,
            name: '????????? ?????????',
            phone_number: '010-9876-5432',
            Reviews: [
              {
                writer: '?????????1',
                content: '?????? ????????? ?????????!!',
                star: 5,
              },
              {
                writer: '?????????2',
                content: '????????? ?????? ??? ??????????????????^^',
                star: 4,
              },
              {
                writer: '?????????3',
                content: '?????? ?????? ???????????????..????????? ??? ??????????????????..',
                star: 2,
              },
            ],
          },
        };
      },
    })) as any;

    const results = {
      start_point: '?????? ????????? ??????',
      destination: '?????? ????????? ?????????',
      move_date: '2021-12-30',
      move_time: '13:30',
      starsAvg: 3.7,
      cost: 200000,
      BusinessPerson: {
        id: 10,
        name: '????????? ?????????',
        phone_number: '010-9876-5432',
        Reviews: [
          {
            writer: '?????????1',
            content: '?????? ????????? ?????????!!',
            star: 5,
          },
          {
            writer: '?????????2',
            content: '????????? ?????? ??? ??????????????????^^',
            star: 4,
          },
          {
            writer: '?????????3',
            content: '?????? ?????? ???????????????..????????? ??? ??????????????????..',
            star: 2,
          },
        ],
      },
    };
    expect(await service.getContract(11)).toStrictEqual({
      results: results,
      status: 200,
    });
  });

  it('getContract fail by not exist myMovingInfo', () => {
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
      getOne() {
        return null;
      },
    })) as any;

    expect(service.getContract(12)).rejects.toThrow(
      new ForbiddenException('???????????? ????????? ???????????? ????????????.'),
    );
  });

  it('getContract fail by not exist myMovingInfo', () => {
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
      getOne() {
        return { id: 1 };
      },
    })) as any;

    mockNegotiationsRepository.createQueryBuilder = jest.fn(() => ({
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

    expect(service.getContract(12)).rejects.toThrow(
      new NotFoundException('?????? ???????????? ???????????? ????????????.'),
    );
  });

  it('writeReview success', async () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return { MovingStatusId: 4 };
      },
    })) as any;

    mockReviewsRepository.createQueryBuilder = jest.fn(() => ({
      innerJoin() {
        return this;
      },
      select() {
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
      execute() {
        return this;
      },
    })) as any;

    const user = {
      id: 1,
      name: '?????????',
      email: 'kakarot@coco.com',
      phone_number: '010-0000-0000',
    };
    const data = { content: '????????????', star: 5 };
    expect(await service.writeReview(user, 1, 3, data)).toStrictEqual({
      message: '?????? ?????? ??????!',
      status: 201,
    });
  });

  it('writeReview fail by movingStatus is not done', () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return { MovingStatusId: 3 };
      },
    })) as any;

    const user = {
      id: 1,
      name: '?????????',
      email: 'kakarot@coco.com',
      phone_number: '010-0000-0000',
    };
    const data = { content: '????????????', star: 5 };
    expect(service.writeReview(user, 1, 3, data)).rejects.toThrow(
      new ForbiddenException('????????? ???????????? ???????????????.'),
    );
  });

  it('writeReview fail by aleady write review', () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return { MovingStatusId: 4 };
      },
    })) as any;

    mockReviewsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return { id: 1 };
      },
    })) as any;

    const user = {
      id: 1,
      name: '?????????',
      email: 'kakarot@coco.com',
      phone_number: '010-0000-0000',
    };
    const data = { content: '????????????', star: 5 };
    expect(service.writeReview(user, 1, 3, data)).rejects.toThrow(
      new ForbiddenException('?????? ????????? ?????????????????????.'),
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
            createdAt: '2022-01-30 19:06:04.268965',
          },
          {
            message: 'system message2',
            createdAt: '2022-01-31 19:06:04.268965',
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

    const pagenation = { page: 1, perPage: 20 };
    expect(await service.readMessage(1, pagenation)).toStrictEqual({
      messages: [
        {
          message: 'system message1',
          createdAt: '2022-01-30 19:06:04.268965',
        },
        {
          message: 'system message2',
          createdAt: '2022-01-31 19:06:04.268965',
        },
      ],
      status: 201,
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

    const pagenation = { page: 1, perPage: 20 };
    expect(await service.readMessage(1, pagenation)).toStrictEqual({
      message: '?????? ???????????? ????????????.',
      status: 200,
    });
  });

  it('unreadCount success', async () => {
    const checkLastDate = (mockSystemMessagesRepository.createQueryBuilder =
      jest.fn(() => ({
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
      })) as any);

    expect(await service.unreadCount(1)).toStrictEqual({
      count: 3,
      status: 200,
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
