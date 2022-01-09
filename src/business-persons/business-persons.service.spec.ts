import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPersonsService } from './business-persons.service';

describe('BusinessPersonsService', () => {
  let service: BusinessPersonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessPersonsService],
    }).compile();

    service = module.get<BusinessPersonsService>(BusinessPersonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
