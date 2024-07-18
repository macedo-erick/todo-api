import { Checklist } from './checklist.model';
import { Comment } from './comment.model';
import { Activity } from './activity.model';
import { Attachment } from './attachment.model';
import { Priority } from '../enums/priority.enum';
import { CardType } from '../enums/card-type.enum';

export class Card {
  name: string;
  description: string;
  createdDate: Date;
  checklist: Checklist;
  comments: Comment[];
  activities: Activity[];
  attachments: Attachment[];
  priority: Priority;
  storyPoints: number;
  timeSpent: number;
  type: CardType;
  sprintId: string;
}
