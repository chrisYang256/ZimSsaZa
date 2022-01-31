import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
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

import Mock = jest.Mock;
import { CreateUserDto } from './dto/create-user.dto';

export class MockUsersRepository {}
export class MockMovingInformationsRepository {}
export class MockMovingGoodsRepository {}
export class MockLoadImagesRepository {}
export class MockAreaCodesRepository {}
export class MockSystemMessagesRepository {}
export class MockNegotiationsRepository {}
export class MockReviewsRepository {}

describe('UsersService', () => {
  let service: UsersService;
  // let connection: Connection;
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
        Connection,
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
    // connection = module.get<Connection>(Connection);
    mockUsersRepository = module.get(getRepositoryToken(Users));
    mockMovingInformationsRepository = module.get(getRepositoryToken(MovingInformations));
    mockMovingGoodsRepository = module.get(getRepositoryToken(MovingGoods));
    mockLoadImagesRepository = module.get(getRepositoryToken(LoadImages));
    mockAreaCodesRepository = module.get(getRepositoryToken(AreaCodes));
    mockSystemMessagesRepository = module.get(getRepositoryToken(SystemMessages));
    mockNegotiationsRepository = module.get(getRepositoryToken(Negotiations));
    mockReviewsRepository = module.get(getRepositoryToken(Reviews));
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  it('signUp success', async () => {
    // mockUsersRepository.createQueryBuilder = jest.fn(() => ({
    //   where() {
    //     return this;
    //   },
    //   getOne() {
    //     return;
    //   }
    // })) as any;

    mockUsersRepository.createQueryBuilder = jest.fn(() => ({
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
        return {
          "identifiers": [
            {
              "id": 8
            }
          ],
          "generatedMaps": [
            {
              "id": 8,
              "createdAt": "2022-01-31T06:57:28.582Z",
              "updatedAt": "2022-01-31T06:57:28.582Z"
            }
          ],
          "raw": {
            "fieldCount": 0,
            "affectedRows": 1,
            "insertId": 8,
            "info": "",
            "serverStatus": 3,
            "warningStatus": 0
          }
        }
      }
    })) as any;

    const value = await {
      name: "브래드 피트",
      email: "zimssaza@gmail.com",
      phone_number: "010-0000-0000",
      password: "1234abcd!"
    } as CreateUserDto;
    console.log('value', value)
    return expect(service.signUp(value))
      .resolves.toBe({
        "identifiers": [
          {
            "id": 8
          }
        ],
        "generatedMaps": [
          {
            "id": 8,
            "createdAt": "2022-01-31T06:57:28.582Z",
            "updatedAt": "2022-01-31T06:57:28.582Z"
          }
        ],
        "raw": {
          "fieldCount": 0,
          "affectedRows": 1,
          "insertId": 8,
          "info": "",
          "serverStatus": 3,
          "warningStatus": 0
        }
    });
  });
});
