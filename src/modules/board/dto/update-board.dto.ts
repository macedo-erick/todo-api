import { List } from '../models/list.model';

export class UpdateBoardDto {
  _id: string;
  name: string;
  list: List[];
  userId: string;
}
