import { Sprint } from '../models/sprint.model';

export class CreateBoardDto {
  name: string;
  sprints: Sprint[];
}
