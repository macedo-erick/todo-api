import { Test, TestingModule } from '@nestjs/testing';
import { BoardGateway } from './board.gateway';
import { BoardService } from './board.service';

describe('BoardGateway', () => {
  let gateway: BoardGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardGateway, BoardService],
    }).compile();

    gateway = module.get<BoardGateway>(BoardGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
