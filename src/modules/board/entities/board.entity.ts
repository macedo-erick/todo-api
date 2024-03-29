import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { List } from '../models/list.model';
import { HydratedDocument } from 'mongoose';

export type BoardDocument = HydratedDocument<Board>;

@Schema()
export class Board {
  @Prop()
  name: string;

  @Prop()
  lists: List[];

  @Prop()
  userId: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
