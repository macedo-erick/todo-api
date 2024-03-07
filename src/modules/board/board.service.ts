import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from './entities/board.entity';
import { Model } from 'mongoose';
import { UsersBoards } from './entities/users-boards.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
    @InjectModel(UsersBoards.name)
    private readonly usersBoardsModel: Model<UsersBoards>,
  ) {}

  async create(createBoardDto: CreateBoardDto, userId: string) {
    const { _id: boardId, name } = await new this.boardModel(
      createBoardDto,
    ).save();

    return new this.usersBoardsModel({
      boardId,
      name,
      userId,
      isAdmin: true,
    });
  }

  async findAll(userId: string) {
    const boards = await this.usersBoardsModel.find({ userId }).exec();

    return boards.map(({ _id, name }) => ({ _id, name }));
  }

  findOne(id: string) {
    return this.boardModel.findById(id).exec();
  }

  findByName(userId: string, name: string) {
    if (name) {
      return this.usersBoardsModel.find({
        userId,
        name: { $regex: `.*${name}.*`, $options: 'i' },
      });
    }

    return this.findAll(userId);
  }

  update(id: string, updateBoardDto: UpdateBoardDto) {
    return this.boardModel.findByIdAndUpdate(id, updateBoardDto).exec();
  }

  async remove(id: string) {
    await this.boardModel.findByIdAndDelete(id).exec();

    return this.usersBoardsModel.findByIdAndDelete(id).exec();
  }
}
