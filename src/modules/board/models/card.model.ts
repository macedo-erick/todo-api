import { Checklist } from './checklist.model';
import { Comment } from './comment.model';
import { Activity } from './activity.model';
import { Attachment } from './attachment.model';
import { Priority } from '../enums/priority.enum';

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
  attachments: Attachment[];
}
