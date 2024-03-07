import { Checklist } from './checklist.model';
import { Priority } from './priority.entity';
import { Comment } from './comment.model';

export class Card {
  name: string;
  description: string;
  createdDate: Date;
  dueDate: Date;
  timeSpent: number;
  finished: boolean;
  checklist: Checklist;
  priority: Priority;
  comments: Comment[];
}
