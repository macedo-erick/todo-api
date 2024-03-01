import { Checklist } from './checklist.model';
import { Priority } from './priority.entity';

export class Card {
  name: string;
  description: string;
  createdDate: Date;
  dueDate: Date;
  finished: boolean;
  checklist: Checklist;
  priority: Priority;
}
