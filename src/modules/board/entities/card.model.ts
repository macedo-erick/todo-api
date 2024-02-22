import { Checklist } from './checklist.model';

export class Card {
  name: string;
  description: string;
  dueDate: Date;
  finished: boolean;
  checklist: Checklist;
}
