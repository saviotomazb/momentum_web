import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Task, TaskStatus } from '../../models/task.model';
import { TaskList } from '../../models/task-list.model';
import { Subtask } from '../../models/subtask.model';

export interface TaskCardViewModel {
  list: TaskList;
  tasks: Task[];
  subtasksByTask: Record<string, Subtask[]>;
}

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './task-card.html',
})
export class TaskCardComponent {
  @Input({ required: true })
  viewModel!: TaskCardViewModel;

  @Input()
  editing = false;

  @Output()
  toggleEditing = new EventEmitter<string>();

  @Output()
  toggleSubtask = new EventEmitter<Subtask>();

  @Output()
  editSubtask = new EventEmitter<Subtask>();

  protected readonly TaskStatus = TaskStatus;

  protected get pendingTasks(): Task[] {
    return this.viewModel.tasks.filter(
      (task) => !this.isCompleted(task),
    );
  }

  protected get completedTasks(): Task[] {
    return this.viewModel.tasks.filter(
      (task) => this.isCompleted(task),
    );
  }

  protected isCompleted(task: Task): boolean {
    return task.status === TaskStatus.Completed;
  }

  protected isSubtaskCompleted(subtask: Subtask): boolean {
    return subtask.status === TaskStatus.Completed;
  }

  protected getCompletedCount(tasks: Task[]): number {
    return tasks.filter((task) => this.isCompleted(task)).length;
  }

  protected getProgress(tasks: Task[]): number {
    if (tasks.length === 0) {
      return 0;
    }

    return Math.round((this.getCompletedCount(tasks) / tasks.length) * 100);
  }

  protected getCompletedSubtaskCount(subtasks: Subtask[]): number {
    return subtasks.filter((subtask) =>
      this.isSubtaskCompleted(subtask),
    ).length;
  }

  protected getSubtaskProgress(subtasks: Subtask[]): number {
    if (subtasks.length === 0) {
      return 0;
    }

    return Math.round(
      (this.getCompletedSubtaskCount(subtasks) / subtasks.length) * 100,
    );
  }

  protected getPriorityLabel(priority: number): string {
    switch (priority) {
      case 1:
        return 'Baixa';
      case 2:
        return 'Média';
      case 3:
        return 'Alta';
      default:
        return 'Sem prioridade';
    }
  }

  protected getPriorityClass(priority: number): string {
    switch (priority) {
      case 1:
        return 'border-success/20 bg-success/10 text-success';
      case 2:
        return 'border-warning/20 bg-warning/10 text-warning';
      case 3:
        return 'border-error/20 bg-error/10 text-error';
      default:
        return 'border-border bg-surface text-text-tertiary';
    }
  }

  protected formatDate(date: string | null): string {
    if (!date) {
      return 'Sem data';
    }

    // Evita deslocamento de um dia ao interpretar datas yyyy-MM-dd.
    const dateOnly = date.substring(0, 10);
    const [year, month, day] = dateOnly.split('-').map(Number);

    if (!year || !month || !day) {
      return dateOnly;
    }

    return new Intl.DateTimeFormat('pt-BR').format(
      new Date(year, month - 1, day),
    );
  }
}