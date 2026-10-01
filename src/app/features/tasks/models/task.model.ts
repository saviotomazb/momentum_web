export interface Task {
  id: string;
  userId: string;
  taskListId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  scheduledDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateTaskRequest {
  taskListId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  scheduledDate: string | null;
  dueDate: string | null;
}

export interface UpdateTaskRequest {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  scheduledDate: string | null;
  dueDate: string | null;
}

export enum TaskStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
}

export enum TaskPriority {
  Low = 1,
  Medium = 2,
  High = 3,
}