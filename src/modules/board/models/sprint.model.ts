import { List } from './list.model';
import { SprintStatus } from '../enums/sprint-status';

export class Sprint {
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
}
