export type TaskStatus = 'not-started' | 'in-progress' | 'blocked' | 'final-check' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export type ChecklistItemStatus = 'not-started' | 'in-progress' | 'blocked' | 'final-check' | 'done';

export interface ChecklistItem {
  id: string;
  title: string;
  status: ChecklistItemStatus;
  comment?: string;
}

export interface Task {
  id: string;
  planId: string;
  x: number;
  y: number;
  xRatio: number;
  yRatio: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  authorId: string;
  authorName: string;
  createdAt: number;
  updatedAt: number;
  checklist?: ChecklistItem[];
}

export type NewTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
