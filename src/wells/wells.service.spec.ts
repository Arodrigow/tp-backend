import { Test, TestingModule } from '@nestjs/testing';
import { WellsService } from './wells.service';

describe('WellsService', () => {
  let service: WellsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WellsService],
    }).compile();

    service = module.get<WellsService>(WellsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
