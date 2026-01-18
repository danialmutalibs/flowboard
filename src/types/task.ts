export type Status = 'todo' | 'in-progress' | 'done';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: 'low' | 'medium' | 'high';
  order: number;
  createdAt: number;
}
