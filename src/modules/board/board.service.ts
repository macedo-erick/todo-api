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

  findAll(userId: string) {
    return this.boardModel.find({ userId });
  }

  findOne(id: string) {
    return this.boardModel.findById(id).exec();
  }

  update(id: string, updateBoardDto: UpdateBoardDto) {
    return this.boardModel.findByIdAndUpdate(id, updateBoardDto).exec();
  }

  remove(id: string) {
    return this.boardModel.findByIdAndDelete(id).exec();
  }
}
