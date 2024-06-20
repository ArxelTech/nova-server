import { Test, TestingModule } from '@nestjs/testing';
import { FrinedsService } from './frineds.service';

describe('FrinedsService', () => {
  let service: FrinedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrinedsService],
    }).compile();

    service = module.get<FrinedsService>(FrinedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
