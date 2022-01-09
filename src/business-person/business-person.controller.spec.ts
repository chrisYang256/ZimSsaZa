import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPersonController } from './business-person.controller';

describe('BusinessPersonController', () => {
  let controller: BusinessPersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessPersonController],
    }).compile();

    controller = module.get<BusinessPersonController>(BusinessPersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
