import { List } from '../entities/list.entity';

export class CreateBoardDto {
  name: string;
  list: List[];
  userId: string;
}
