import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Sprint } from '../models/sprint.model';
import { List } from '../models/list.model';

export type BoardDocument = HydratedDocument<Board>;

@Schema()
export class Board {
  @Prop()
  name: string;

  @Prop()
  prefix: string;

  @Prop()
  sprints: Sprint[];

  @Prop()
  lists: List[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
