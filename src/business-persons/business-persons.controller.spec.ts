import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPersonsController } from './business-persons.controller';

describe('BusinessPersonsController', () => {
  let controller: BusinessPersonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessPersonsController],
    }).compile();

    controller = module.get<BusinessPersonsController>(BusinessPersonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
