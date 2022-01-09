import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPersonService } from './business-person.service';

describe('BusinessPersonService', () => {
  let service: BusinessPersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessPersonService],
    }).compile();

    service = module.get<BusinessPersonService>(BusinessPersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
