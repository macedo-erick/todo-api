import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from './entities/board.entity';
import { Model } from 'mongoose';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  create(createBoardDto: CreateBoardDto) {
    return new this.boardModel(createBoardDto).save();
  }

  async findAll(userId: string) {
    const boards = await this.boardModel.find({ userId }).exec();

    return boards.map(({ _id, name }) => ({ _id, name }));
  }

  findOne(id: string) {
    return this.boardModel.findById(id).exec();
  }

  findByName(userId: string, name: string) {
    if (name) {
      return this.boardModel.find({
        userId,
        name: { $regex: `.*${name}.*`, $options: 'i' },
      });
    }

    return this.findAll(userId);
  }

  update(id: string, updateBoardDto: UpdateBoardDto) {
    return this.boardModel.findByIdAndUpdate(id, updateBoardDto).exec();
  }

  remove(id: string) {
    return this.boardModel.findByIdAndDelete(id).exec();
  }
}
