export interface TaskList {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateTaskListRequest {
  name: string;
}

export interface UpdateTaskListRequest {
  name: string;
}