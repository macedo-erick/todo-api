import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BoardDocument = HydratedDocument<UsersBoards>;

@Schema()
export class UsersBoards {
  userId: string;
  boardId: string;
  name: string;
  isAdmin: boolean;
}

export const UsersBoardsSchema = SchemaFactory.createForClass(UsersBoards);
