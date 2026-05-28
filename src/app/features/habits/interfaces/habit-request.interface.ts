export interface HabitRequest {
  title: string;
  description?: string;
  frequency: number;
}

export type HabitFormValue = HabitRequest;
