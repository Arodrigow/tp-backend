import { Test, TestingModule } from '@nestjs/testing';
import { WellsController } from './wells.controller';

describe('WellsController', () => {
  let controller: WellsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WellsController],
    }).compile();

    controller = module.get<WellsController>(WellsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
