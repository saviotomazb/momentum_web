import {
  TaskPriority,
  TaskStatus,
} from './task.model';

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  scheduledDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateSubtaskRequest {
  taskId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  scheduledDate: string | null;
  dueDate: string | null;
}

export interface UpdateSubtaskRequest {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  scheduledDate: string | null;
  dueDate: string | null;
}