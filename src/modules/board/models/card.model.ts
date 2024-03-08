import { Checklist } from './checklist.model';
import { Priority } from './priority.model';
import { Comment } from './comment.model';
import { Activity } from './activity.model';

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
  activities: Activity[];
}
