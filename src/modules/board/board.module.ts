import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardGateway } from './board.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from './entities/board.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
  ],
  providers: [BoardGateway, BoardService],
  controllers: [],
})
export class BoardModule {}
