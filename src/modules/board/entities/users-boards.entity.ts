import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserBoardDocument = HydratedDocument<UsersBoards>;

@Schema({ collection: 'users_boards' })
export class UsersBoards {
  @Prop()
  userId: string;

  @Prop()
  boardId: string;

  @Prop()
  name: string;

  @Prop()
  isAdmin: boolean;
}

export const UsersBoardsSchema = SchemaFactory.createForClass(UsersBoards);
