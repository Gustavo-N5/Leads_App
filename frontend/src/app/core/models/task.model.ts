export type TaskStatus = 'Todo' | 'Doing' | 'Done';

export interface TaskItem {
  id: number;
  leadId: number;
  title: string;
  dueDate?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateDto {
  title: string;
  dueDate?: string;
  status: TaskStatus;
}

export interface TaskUpdateDto {
  title: string;
  dueDate?: string;
  status: TaskStatus;
}

export const TASK_STATUSES: TaskStatus[] = ['Todo', 'Doing', 'Done'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  Todo: 'A Fazer',
  Doing: 'Em Andamento',
  Done: 'Concluído'
};