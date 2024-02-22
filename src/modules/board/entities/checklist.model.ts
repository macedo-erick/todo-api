import { Task } from './task.model';

export interface Checklist {
  name: string;
  tasks: Task[];
}
