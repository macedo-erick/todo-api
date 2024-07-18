import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from './entities/board.entity';
import { Model } from 'mongoose';
import { UserBoardDocument, UsersBoards } from './entities/users-boards.entity';
import { SprintStatus } from './enums/sprint-status';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
    @InjectModel(UsersBoards.name)
    private readonly usersBoardsModel: Model<UserBoardDocument>,
  ) {}

  async create(createBoardDto: CreateBoardDto, userId: string) {
    const { id: boardId } = await new this.boardModel(createBoardDto).save();

    return new this.usersBoardsModel({
      boardId,
      userId,
      isAdmin: true,
    }).save();
  }

  async findAll(userId: string) {
    const userBoards = await this.usersBoardsModel.find({ userId }).exec();
    const boardsIds = userBoards.map(({ boardId }) => boardId);
    const boards = await this.boardModel
      .find({
        _id: { $in: boardsIds },
      })
      .exec();

    return boards.map(({ name, _id: boardId }) => ({ name, boardId }));
  }

  async findOne(id: string) {
    const boardDocument = await this.boardModel.findById(id).exec();
    const { sprints, lists, ...board } = boardDocument.toObject();

    const activeSprintId = sprints.find(
      (sprint) => sprint.status === SprintStatus.ACTIVE,
    ).id;

    const filteredList = lists.map(({ cards, ...list }) => ({
      ...list,
      cards: cards.filter((card) => card.sprintId == activeSprintId),
    }));

    return { ...board, lists: filteredList, sprints };
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
