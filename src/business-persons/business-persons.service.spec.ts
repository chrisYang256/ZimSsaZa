import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { BusinessPersonsService } from './business-persons.service';
import { AreaCodes } from '../entities/AreaCodes';
import { BusinessPersons } from '../entities/BusinessPersons';
import { MovingInformations } from '../entities/MovingInformations';
import { Reviews } from '../entities/Reviews';
import { SystemMessages } from '../entities/SystemMessages';

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
        Connection,
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
  });

  it('should be defined', () => {
    expect(1 + 1).toBe(2);
  });
});
