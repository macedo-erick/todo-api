import { SprintStatus } from '../enums/sprint-status';

export class Sprint {
  id: string;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
}
