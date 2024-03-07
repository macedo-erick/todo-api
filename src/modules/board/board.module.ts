import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardGateway } from './board.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from './entities/board.entity';
import { UsersBoards, UsersBoardsSchema } from './entities/users-boards.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: UsersBoards.name, schema: UsersBoardsSchema },
    ]),
  ],
  providers: [BoardGateway, BoardService],
  controllers: [],
})
export class BoardModule {}
