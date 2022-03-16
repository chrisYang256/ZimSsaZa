import { 
  ForbiddenException, 
  NotFoundException, 
  CACHE_MANAGER 
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Negotiations } from '../entities/Negotiations';
import { SystemMessages } from '../entities/SystemMessages';
import { BusinessPersons } from '../entities/BusinessPersons';
import { MovingInformations } from '../entities/MovingInformations';
import { EventsGateway } from '../events/events.gateway';
import { MovingStatusEnum } from 'src/common/movingStatus.enum';
import { Cache } from 'cache-manager'

export class MockNegotiationsRepository {}
export class MockSystemMessagesRepository {}
export class MockBusinessPersonsRepository {}
export class MockMovingInformationsRepository {}
export class MockEventsGateway {
  server = {
    emit: () => console.log('mockSocketIO::: emit'),
    to: () => console.log('mockSocketIO::: to'),
  };
}

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

let mockCachedValue = {
  get: () => 'hola~ you have succeeded!',
  set: () => jest.fn(),
}

describe('TasksService', () => {
  let service: TasksService;
  let eventsGateway: EventsGateway;
  let cacheManager: Cache;
  let mockNegotiationsRepository: Repository<Negotiations>;
  let mockSystemMessagesRepository: Repository<SystemMessages>;
  let mockBusinessPersonsRepository: Repository<BusinessPersons>;
  let mockMovingInformationsRepository: Repository<MovingInformations>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: Connection,
          useFactory: mockConnection,
        },
        {
          provide: EventsGateway,
          useClass: MockEventsGateway,
        },
        {
          provide: getRepositoryToken(Negotiations),
          useClass: MockNegotiationsRepository,
        },
        {
          provide: getRepositoryToken(SystemMessages),
          useClass: MockSystemMessagesRepository,
        },
        {
          provide: getRepositoryToken(BusinessPersons),
          useClass: MockBusinessPersonsRepository,
        },
        {
          provide: getRepositoryToken(MovingInformations),
          useClass: MockMovingInformationsRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCachedValue,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    eventsGateway = module.get<EventsGateway>(EventsGateway);
    cacheManager = module.get<any>(CACHE_MANAGER);
    mockNegotiationsRepository = module.get(getRepositoryToken(Negotiations));
    mockMovingInformationsRepository = module.get(
      getRepositoryToken(MovingInformations),
    );
    mockSystemMessagesRepository = module.get(
      getRepositoryToken(SystemMessages),
    );
    mockBusinessPersonsRepository = module.get(
      getRepositoryToken(BusinessPersons),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('checkNegoTimout success in case timeoutFilter.length is 0', async () => {
    mockNegotiationsRepository.createQueryBuilder = jest.fn(() => ({
      innerJoin() {
        return this;
      },
      select() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getRawMany() {
        return [];
      },
    })) as any;

    expect(await service.checkNegoTimout()).toBeUndefined();
  });

  it('checkNegoTimout success in case return value', async () => {
    mockNegotiationsRepository.createQueryBuilder = jest.fn(() => ({
      innerJoin() {
        return this;
      },
      leftJoin() {
        return this;
      },
      select() {
        return this;
      },
      update() {
        return this;
      },
      set() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getRawMany() {
        return [
          {
            UserId: 1,
            message:
              '견적서 요청 시간이 만료되었습니다⏰. 견적서 내역을 확인해주세요!',
          },
          {
            UserId: 2,
            message:
              '견적서 요청 시간이 만료되었습니다⏰. 견적서 내역을 확인해주세요!',
          },
        ];
      },
      execute() {
        return this;
      },
    })) as any;

    mockSystemMessagesRepository.createQueryBuilder = jest.fn(() => ({
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
        return this;
      },
    })) as any;

    expect(await service.checkNegoTimout()).toBeUndefined();
  });

  it('submitMovingInfo success', async () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      innerJoin() {
        return this;
      },
      select() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      update() {
        return this;
      },
      set() {
        return this;
      },
      orderBy() {
        return this;
      },
      getMany() {
        return [
          {
            id: 7,
            start_point: '서울 특별시 중구',
            destination: '서울 특별시 동작구',
            move_date: '2021-12-30',
            move_time: '15:30',
            picked_business_person: null,
            user_done: 0,
            business_person_done: 0,
            createdAt: '2022-02-08T06:02:50.447Z',
            updatedAt: '2022-02-08T06:03:12.000Z',
            UserId: 7,
            MovingStatusId: 1,
          },
        ];
      },
      getOne() {
        return {
          id: 7,
          start_point: '서울 특별시 중구',
          destination: '서울 특별시 동작구',
          move_date: '2021-12-30',
          move_time: '15:30',
          picked_business_person: null,
          user_done: 0,
          business_person_done: 0,
          createdAt: '2022-02-08T06:02:50.447Z',
          updatedAt: '2022-02-08T06:03:12.000Z',
          UserId: 7,
          MovingStatusId: 1,
        };
      },
      execute() {
        return this;
      },
    })) as any;

    mockNegotiationsRepository.createQueryBuilder = jest.fn(() => ({
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
        return this;
      },
    })) as any;

    expect(await service.submitMovingInfo(5)).toStrictEqual({
      message: '견적 요청이 정상적으로 처리되었습니다!',
      status: 201,
    });
  });

  it('submitMovingInfo fail by no movingInfo', async () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getMany() {
        return null;
      },
    })) as any;

    expect(service.submitMovingInfo(5)).rejects.toThrow(
      new NotFoundException('이삿짐 정보가 존재하지 않습니다.'),
    );
  });

  it('submitMovingInfo fail by already exist thing in progress', async () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getMany() {
        return [
          {
            id: 7,
            start_point: '서울 특별시 중구',
            destination: '서울 특별시 동작구',
            move_date: '2021-12-30',
            move_time: '15:30',
            picked_business_person: null,
            user_done: 0,
            business_person_done: 0,
            createdAt: '2022-02-08T06:02:50.447Z',
            updatedAt: '2022-02-08T06:03:12.000Z',
            UserId: 7,
            MovingStatusId: 2,
          },
        ];
      },
    })) as any;

    expect(service.submitMovingInfo(5)).rejects.toThrow(
      new ForbiddenException('이미 진행 중인 이사정보가 존재합니다.'),
    );
  });

  it('getMovingInfoList success in case cachedValue is not null', async () => {

    const pagenation = { perPage: 20, page: 1 };
    const businessPerson = {
      id: 1,
      name: '박정직',
      email: 'zimssaza@gmail.com',
      phone_number: '010-0000-0000',
      business_license: '123-45-67890',
      finish_count: 100,
      AreaCodes: [{ code: 1 }, { code: 2 }],
    };
    expect(
      await service.getMovingInfoList(pagenation, businessPerson),
    ).toStrictEqual({
      movingInfoList: 'hola~ you have succeeded!',
      status: 200,
    });
  });

  it('getMovingInfoList success in case movingInfoList is 0', async () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      innerJoin() {
        return this;
      },
      select() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      take() {
        return this;
      },
      skip() {
        return this;
      },
      getMany() {
        return [];
      },
    })) as any;

    mockCachedValue.get = jest.fn(() => null) // update for return value of get method

    const pagenation = { perPage: 20, page: 1 };
    const businessPerson = {
      id: 1,
      name: '박정직',
      email: 'zimssaza@gmail.com',
      phone_number: '010-0000-0000',
      business_license: '123-45-67890',
      finish_count: 100,
      AreaCodes: [{ code: 1 }, { code: 2 }],
    };
    expect(
      await service.getMovingInfoList(pagenation, businessPerson),
    ).toStrictEqual({
      message: '현재 담당구역 내 견적 요청이 존재하지 않습니다.',
      status: 200,
    });
  });

  it('getMovingInfoList success', async () => {
    const movingInfoList = [
      {
        id: 5,
        start_point: '서울 특별시 중구',
        destination: '서울 특별시 동작구',
        createdAt: '2022-02-07T06:36:52.309Z',
      },
      {
        id: 9,
        start_point: '서울 특별시 영등포구',
        destination: '서울 특별시 용산구',
        createdAt: '2022-02-09T06:36:52.309Z',
      },
      {
        id: 39,
        start_point: '서울 특별시 동작구',
        destination: '서울 특별시 용산구',
        createdAt: '2022-02-10T06:36:52.309Z',
      },
    ];
   
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      innerJoin() {
        return this;
      },
      select() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      take() {
        return this;
      },
      skip() {
        return this;
      },
      getMany() {
        return movingInfoList;
      },
    })) as any;

    const pagenation = { perPage: 20, page: 1 };
    const businessPerson = {
      id: 1,
      name: '박정직',
      email: 'zimssaza@gmail.com',
      phone_number: '010-0000-0000',
      business_license: '123-45-67890',
      finish_count: 100,
      AreaCodes: [{ code: 1 }, { code: 2 }],
    };
    expect(
      await service.getMovingInfoList(pagenation, businessPerson),
    ).toStrictEqual({
      movingInfoList: movingInfoList,
      status: 200,
    });
  });

  it('getMovingInfoDetail success', async () => {
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
        return null;
      },
    });

    mock.mockReturnValueOnce({
      innerJoin() {
        return this;
      },
      leftJoin() {
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
      getOne() {
        return { result: 'something' };
      },
    });

    expect(await service.getMovingInfoDetail(3)).toStrictEqual({
      results: { result: 'something' },
      status: 200,
    });
  });

  it('getMovingInfoDetail fail by done/cancel of estimate request', () => {
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

    expect(service.getMovingInfoDetail(3)).rejects.toThrow(
      new ForbiddenException('견적 요청 완료/취소된 게시물입니다.'),
    );
  });

  it('getMovingInfoDetail fail by No result', () => {
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
        return null;
      },
    });

    mock.mockReturnValueOnce({
      innerJoin() {
        return this;
      },
      leftJoin() {
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
      getOne() {
        return null;
      },
    });

    expect(service.getMovingInfoDetail(3)).rejects.toThrow(
      new ForbiddenException('게시물이 존재하지 않습니다.'),
    );
  });

  it('submitEstimate success', async () => {
    const mock = (mockNegotiationsRepository.createQueryBuilder = jest.fn(
      () => ({}),
    ) as any);

    const findMovingInfo = mock.mockReturnValueOnce({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return this;
      },
    });

    const isDuplication = mock.mockReturnValueOnce({
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

    const checkBeforeSubmitCount = mock.mockReturnValueOnce({
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
        return this;
      },
    });

    mock.mockReturnValueOnce({
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
        return this;
      },
    });

    const checkAfterSubmitCount = mock.mockReturnValueOnce({
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
        return this;
      },
    });

    const owner = (mockMovingInformationsRepository.createQueryBuilder =
      jest.fn(() => ({
        innerJoin() {
          return this;
        },
        addSelect() {
          return this;
        },
        where() {
          return this;
        },
        getOne() {
          return this; // { User: { email: '고구마@gmail.com' } };
        },
      })) as any);

    const sendSystemMessage = (mockSystemMessagesRepository.createQueryBuilder =
      jest.fn(() => ({
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
          return this;
        },
      })) as any);

    mock.mockReturnValueOnce({
      update() {
        return this;
      },
      set() {
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
    });

    expect(await service.submitEstimate(3, 5, { cost: 300000 })).toStrictEqual({
      message: '견적서 제출 완료!',
      status: 201,
    });
  });

  it('submitEstimate success in case checkAfterSubmitCount is 10', async () => {
    const mock = (mockNegotiationsRepository.createQueryBuilder = jest.fn(
      () => ({}),
    ) as any);

    const findMovingInfo = mock.mockReturnValueOnce({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return this;
      },
    });

    const isDuplication = mock.mockReturnValueOnce({
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

    const checkBeforeSubmitCount = mock.mockReturnValueOnce({
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
        return this;
      },
    });

    mock.mockReturnValueOnce({
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
        return this;
      },
    });

    const checkAfterSubmitCount = mock.mockReturnValueOnce({
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
        return { count: 10 };
      },
    });

    const owner = (mockMovingInformationsRepository.createQueryBuilder =
      jest.fn(() => ({
        innerJoin() {
          return this;
        },
        addSelect() {
          return this;
        },
        where() {
          return this;
        },
        getOne() {
          return { User: { id: 11 } };
        },
      })) as any);

    const sendSystemMessage = (mockSystemMessagesRepository.createQueryBuilder =
      jest.fn(() => ({
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
          return this;
        },
      })) as any);

    mock.mockReturnValueOnce({
      update() {
        return this;
      },
      set() {
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
    });

    expect(await service.submitEstimate(3, 5, { cost: 300000 })).toStrictEqual({
      message: '견적서 제출 완료!',
      status: 201,
    });
  });

  it('submitEstimate fail by No findMovingInfo', () => {
    mockNegotiationsRepository.createQueryBuilder = jest.fn(() => ({
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

    expect(service.submitEstimate(3, 5, { cost: 300000 })).rejects.toThrow(
      new NotFoundException('해당 견적요청이 존재하지 않습니다.'),
    );
  });

  it('submitEstimate fail by duplicate submit', () => {
    const mock = (mockNegotiationsRepository.createQueryBuilder = jest.fn(
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
        return this;
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
        return { someData: 'data' };
      },
    });

    expect(service.submitEstimate(3, 5, { cost: 300000 })).rejects.toThrow(
      new ForbiddenException('이미 해당 견적요청에 응답하셨습니다.'),
    );
  });

  it('submitEstimate fail by already submit 10 estimate', () => {
    const mock = (mockNegotiationsRepository.createQueryBuilder = jest.fn(
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
        return this;
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
        return null;
      },
    });

    mock.mockReturnValueOnce({
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
        return { count: 10 };
      },
    });

    expect(service.submitEstimate(3, 5, { cost: 300000 })).rejects.toThrow(
      new ForbiddenException('이미 10건의 견적서 접수가 완료되었습니다.'),
    );
  });

  it('submitEstimate fail by no the requested user', () => {
    const mock = (mockNegotiationsRepository.createQueryBuilder = jest.fn(
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
        return this;
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
        return null;
      },
    });

    mock.mockReturnValueOnce({
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
        return this;
      },
    });

    mock.mockReturnValueOnce({
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
        return this;
      },
    });

    mock.mockReturnValueOnce({
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
        return this;
      },
    });

    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      innerJoin() {
        return this;
      },
      addSelect() {
        return this;
      },
      where() {
        return this;
      },
      getOne() {
        return null;
      },
    })) as any;

    expect(service.submitEstimate(3, 5, { cost: 300000 })).rejects.toThrow(
      new ForbiddenException('견적 요청을 한 유저가 존재하지 않습니다.'),
    );
  });

  it('checkEstimateList success', async () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      orderBy() {
        return this;
      },
      getOne() {
        return this;
      },
    })) as any;

    mockNegotiationsRepository.createQueryBuilder = jest.fn(() => ({
      leftJoin() {
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
      orderBy() {
        return this;
      },
      addOrderBy() {
        return this;
      },
      take() {
        return this;
      },
      getMany() {
        return [
          {
            id: 20,
            cost: 200000,
            BusinessPerson: {
              id: 10,
              name: '정의의 기사님',
              finish_count: 4,
              Reviews: [
                {
                  id: 3,
                  writer: '박효신3',
                  content: '리뷰 보고 기대했는데..안좋은 일 있으셨나봐요..',
                  star: 2,
                  createdAt: '2022-02-07T06:36:52.353Z',
                },
                {
                  id: 2,
                  writer: '박효신2',
                  content: '덕분에 이사 잘 마무리했슴다^^',
                  star: 4,
                  createdAt: '2022-02-07T06:36:52.353Z',
                },
                {
                  id: 1,
                  writer: '박효신1',
                  content: '정말 좋으신 기사님!!',
                  star: 5,
                  createdAt: '2022-02-07T06:36:52.353Z',
                },
              ],
            },
            MovingInformation: {
              id: 5,
            },
          },
        ];
      },
    })) as any;

    expect(await service.checkEstimateList(3)).toStrictEqual({
      estimateList: [
        {
          id: 20,
          cost: 200000,
          BusinessPerson: {
            id: 10,
            name: '정의의 기사님',
            finish_count: 4,
            starsAvg: 3.7,
            Reviews: [
              {
                id: 3,
                writer: '박효신3',
                content: '리뷰 보고 기대했는데..안좋은 일 있으셨나봐요..',
                star: 2,
                createdAt: '2022-02-07T06:36:52.353Z',
              },
              {
                id: 2,
                writer: '박효신2',
                content: '덕분에 이사 잘 마무리했슴다^^',
                star: 4,
                createdAt: '2022-02-07T06:36:52.353Z',
              },
              {
                id: 1,
                writer: '박효신1',
                content: '정말 좋으신 기사님!!',
                star: 5,
                createdAt: '2022-02-07T06:36:52.353Z',
              },
            ],
          },
          MovingInformation: {
            id: 5,
          },
        },
      ],
      status: 200,
    });
  });

  it('checkEstimateList success in case estimateList is 0', async () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      orderBy() {
        return this;
      },
      getOne() {
        return this;
      },
    })) as any;

    mockNegotiationsRepository.createQueryBuilder = jest.fn(() => ({
      leftJoin() {
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
      orderBy() {
        return this;
      },
      addOrderBy() {
        return this;
      },
      take() {
        return this;
      },
      getMany() {
        return [];
      },
    })) as any;

    expect(await service.checkEstimateList(3)).toStrictEqual({
      message: '받은 견적 내역이 없습니다.',
      status: 200,
    });
  });

  it('checkEstimateList fail by No myMovingInfo', async () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      orderBy() {
        return this;
      },
      getOne() {
        return null;
      },
    })) as any;

    expect(service.checkEstimateList(3)).rejects.toThrow(
      new NotFoundException('견적요청 중인 이삿짐 정보가 없습니다.'),
    );
  });

  it('pickEstimate success', async () => {
    mockBusinessPersonsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return this;
      },
    })) as any;

    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      update() {
        return this;
      },
      set() {
        return this;
      },
      where() {
        return this;
      },
      getOne() {
        return { picked_business_person: null };
      },
      execute() {
        return this;
      },
    })) as any;

    mockSystemMessagesRepository.createQueryBuilder = jest.fn(() => ({
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
        return this;
      },
    })) as any;

    expect(await service.pickEstimate(3, 7)).toStrictEqual({
      message: '기사님 선택 완료!',
      status: 201,
    });
  });

  it('pickEstimate fail by No businessPerson', async () => {
    mockBusinessPersonsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return null;
      },
    })) as any;

    expect(service.pickEstimate(3, 7)).rejects.toThrow(
      new NotFoundException('존재하지 않거나 탈퇴한 기사님입니다.'),
    );
  });

  it('pickEstimate fail by duplicate choice', async () => {
    mockBusinessPersonsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return { name: '복받으세요' };
      },
    })) as any;

    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return { picked_business_person: 7 };
      },
    })) as any;

    expect(service.pickEstimate(3, 7)).rejects.toThrow(
      new ForbiddenException(
        `이미 '복받으세요'기사님의 견적서를 선택하셨습니다.`,
      ),
    );
  });

  it('makeMovingToDoneByUser success in case checkDone is true', async () => {
    const mock = (mockMovingInformationsRepository.createQueryBuilder = jest.fn(
      () => ({}),
    ) as any);

    mock.mockReturnValueOnce({
      where() {
        return this;
      },
      getOne() {
        return {
          MovingStatusId: MovingStatusEnum.PICK,
        };
      },
    });

    mock.mockReturnValueOnce({
      update() {
        return this;
      },
      set() {
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
    });

    const checkedBusinessPersonDone = mock.mockReturnValueOnce({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return { id: 3 };
      },
    });

    mockSystemMessagesRepository.createQueryBuilder = jest.fn(() => ({
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
        return this;
      },
    })) as any;

    mockBusinessPersonsRepository.createQueryBuilder = jest.fn(() => ({
      select() {
        return this;
      },
      update() {
        return this;
      },
      set() {
        return this;
      },
      where() {
        return this;
      },
      getOne() {
        return this;
      },
      execute() {
        return this;
      },
    })) as any;

    mock.mockReturnValueOnce({
      update() {
        return this;
      },
      set() {
        return this;
      },
      where() {
        return this;
      },
      execute() {
        return this;
      },
    });

    expect(await service.makeMovingToDoneByUser(3, 7)).toStrictEqual({
      message: '이사완료 확인!',
      status: 201,
    });
  });

  it('makeMovingToDoneByUser success in case checkDone is false', async () => {
    const mock = (mockMovingInformationsRepository.createQueryBuilder = jest.fn(
      () => ({}),
    ) as any);

    mock.mockReturnValueOnce({
      where() {
        return this;
      },
      getOne() {
        return {
          MovingStatusId: MovingStatusEnum.PICK,
        };
      },
    });

    mock.mockReturnValueOnce({
      update() {
        return this;
      },
      set() {
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
    });

    const checkedBusinessPersonDone = mock.mockReturnValueOnce({
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

    mockSystemMessagesRepository.createQueryBuilder = jest.fn(() => ({
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
        return this;
      },
    })) as any;

    expect(await service.makeMovingToDoneByUser(3, 7)).toStrictEqual({
      message: '이사완료 확인!',
      status: 201,
    });
  });

  it('makeMovingToDoneByUser fail by user_done column is true', () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return { user_done: true };
      },
    })) as any;

    expect(service.makeMovingToDoneByUser(3, 7)).rejects.toThrow(
      new ForbiddenException('이미 완료 확인을 하셨습니다.'),
    );
  });

  it('makeMovingToDoneByUser fail by moving status is not pick', () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return { MovingStatusId: MovingStatusEnum.STAY };
      },
    })) as any;

    expect(service.makeMovingToDoneByUser(3, 7)).rejects.toThrow(
      new ForbiddenException('잘못된 접근입니다.'),
    );
  });

  it('makeMovingToDoneByUser fail by moving status is done', () => {
    const mock = (mockMovingInformationsRepository.createQueryBuilder = jest.fn(
      () => ({}),
    ) as any);

    mock.mockReturnValueOnce({
      where() {
        return this;
      },
      getOne() {
        return {
          MovingStatusId: MovingStatusEnum.PICK,
        };
      },
    });

    mock.mockReturnValueOnce({
      update() {
        return this;
      },
      set() {
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
    });

    const checkedBusinessPersonDone = mock.mockReturnValueOnce({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return {
          id: 3,
          MovingStatusId: MovingStatusEnum.DONE,
        };
      },
    });

    expect(service.makeMovingToDoneByUser(3, 7)).rejects.toThrow(
      new ForbiddenException('이미 완료된 이사건입니다.'),
    );
  });

  ///// ///// ///// ///// ///// ///// ///// ///// ///// /////

  it('makeMovingToDoneByBusinessPerson success in case checkDone is true', async () => {
    const mock = (mockMovingInformationsRepository.createQueryBuilder = jest.fn(
      () => ({}),
    ) as any);

    mock.mockReturnValueOnce({
      where() {
        return this;
      },
      getOne() {
        return {
          MovingStatusId: MovingStatusEnum.PICK,
        };
      },
    });

    mock.mockReturnValueOnce({
      update() {
        return this;
      },
      set() {
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
    });

    const checkedUserDone = mock.mockReturnValueOnce({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return { id: 3 };
      },
    });

    mockSystemMessagesRepository.createQueryBuilder = jest.fn(() => ({
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
        return this;
      },
    })) as any;

    mockBusinessPersonsRepository.createQueryBuilder = jest.fn(() => ({
      select() {
        return this;
      },
      update() {
        return this;
      },
      set() {
        return this;
      },
      where() {
        return this;
      },
      getOne() {
        return this;
      },
      execute() {
        return this;
      },
    })) as any;

    mock.mockReturnValueOnce({
      update() {
        return this;
      },
      set() {
        return this;
      },
      where() {
        return this;
      },
      execute() {
        return this;
      },
    });

    expect(await service.makeMovingToDoneByBusinessPerson(3, 7)).toStrictEqual({
      message: '이사완료 확인!',
      status: 201,
    });
  });

  it('makeMovingToDoneByBusinessPerson success in case checkDone is false', async () => {
    const mock = (mockMovingInformationsRepository.createQueryBuilder = jest.fn(
      () => ({}),
    ) as any);

    mock.mockReturnValueOnce({
      where() {
        return this;
      },
      getOne() {
        return {
          MovingStatusId: MovingStatusEnum.PICK,
        };
      },
    });

    mock.mockReturnValueOnce({
      update() {
        return this;
      },
      set() {
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
    });

    const checkedBusinessPersonDone = mock.mockReturnValueOnce({
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

    mockSystemMessagesRepository.createQueryBuilder = jest.fn(() => ({
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
        return this;
      },
    })) as any;

    expect(await service.makeMovingToDoneByBusinessPerson(3, 7)).toStrictEqual({
      message: '이사완료 확인!',
      status: 201,
    });
  });

  it('makeMovingToDoneByBusinessPerson fail by user_done column is true', () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return { business_person_done: true };
      },
    })) as any;

    expect(service.makeMovingToDoneByBusinessPerson(3, 7)).rejects.toThrow(
      new ForbiddenException('이미 완료 확인을 하셨습니다.'),
    );
  });

  it('makeMovingToDoneByBusinessPerson fail by moving status is not pick', () => {
    mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({
      where() {
        return this;
      },
      getOne() {
        return { 
          MovingStatusId: MovingStatusEnum.DONE 
        };
      },
    })) as any;

    expect(service.makeMovingToDoneByBusinessPerson(3, 7)).rejects.toThrow(
      new ForbiddenException('잘못된 접근입니다.'),
    );
  });

  it('makeMovingToDoneByBusinessPerson fail by moving status is done', () => {
    const mock = mockMovingInformationsRepository.createQueryBuilder = jest.fn(() => ({})) as any;

    mock.mockReturnValueOnce({
      where() {
        return this;
      },
      getOne() {
        return {
          MovingStatusId: MovingStatusEnum.PICK
        };
      },
    })

    mock.mockReturnValueOnce({
      update() {
        return this;
      },
      set() {
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
    })

    const checkedBusinessPersonDone = mock.mockReturnValueOnce({
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getOne() {
        return {
          id: 3,
          MovingStatusId: MovingStatusEnum.DONE
        };
      },
    })

    expect(service.makeMovingToDoneByBusinessPerson(3, 7)).rejects.toThrow(
      new ForbiddenException('이미 완료된 이사건입니다.')
    );
  });
});
