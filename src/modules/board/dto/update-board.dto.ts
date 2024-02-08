import { List } from '../entities/list.entity';

export class UpdateBoardDto {
  _id: string;
  name: string;
  list: List[];
  userId: string;
}
