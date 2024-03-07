import { List } from '../models/list.model';

export class CreateBoardDto {
  name: string;
  list: List[];
}
