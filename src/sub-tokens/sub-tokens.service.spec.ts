import { Test, TestingModule } from '@nestjs/testing';
import { SubTokensService } from './sub-tokens.service';

describe('SubTokensService', () => {
  let service: SubTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubTokensService],
    }).compile();

    service = module.get<SubTokensService>(SubTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
