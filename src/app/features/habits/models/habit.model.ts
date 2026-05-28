export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: number;
  completedToday: boolean;
  currentStreak: number;
  totalCompletions: number;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
