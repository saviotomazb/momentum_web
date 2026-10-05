import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ErrorNotificationService } from '../../../core/services/error-notification.service';
import { Task } from '../models/task.model';
import { TaskList } from '../models/task-list.model';
import { TaskListsService } from '../services/task-lists.service';
import { TasksService } from '../services/tasks.service';

interface TaskListViewModel {
  list: TaskList;
  tasks: Task[];
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tasks.html',
})
export class TasksComponent {
  private readonly taskListsService = inject(TaskListsService);
  private readonly tasksService = inject(TasksService);
  private readonly notificationService = inject(
    ErrorNotificationService,
  );

  protected readonly taskLists = signal<TaskList[]>([]);
  protected readonly tasksByList = signal<TaskListViewModel[]>([]);

  protected readonly selectedListIds = signal<Set<string>>(
    new Set(),
  );

  protected readonly loading = signal(true);

  protected readonly selectedLists = computed(() => {
    const selectedIds = this.selectedListIds();

    return this.taskLists().filter((list) =>
      selectedIds.has(list.id),
    );
  });

  protected readonly visibleTaskLists = computed(() => {
    const selectedIds = this.selectedListIds();

    return this.tasksByList().filter(({ list }) =>
      selectedIds.has(list.id),
    );
  });

  constructor() {
    this.loadTaskLists();
  }

  protected isListSelected(id: string): boolean {
    return this.selectedListIds().has(id);
  }

  protected toggleList(id: string): void {
    this.selectedListIds.update((selectedIds) => {
      const next = new Set(selectedIds);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  protected selectAllLists(): void {
    this.selectedListIds.set(
      new Set(this.taskLists().map((list) => list.id)),
    );
  }

  protected clearLists(): void {
    this.selectedListIds.set(new Set());
  }

  protected getTasks(listId: string): Task[] {
    return (
      this.tasksByList().find(
        ({ list }) => list.id === listId,
      )?.tasks ?? []
    );
  }

  protected getPendingTasks(tasks: Task[]): Task[] {
    return tasks.filter((task) => !this.isCompleted(task));
  }

  protected getCompletedTasks(tasks: Task[]): Task[] {
    return tasks.filter((task) => this.isCompleted(task));
  }

  protected getCompletedCount(tasks: Task[]): number {
    return this.getCompletedTasks(tasks).length;
  }

  protected getProgress(tasks: Task[]): number {
    if (tasks.length === 0) {
      return 0;
    }

    return Math.round(
      (this.getCompletedCount(tasks) / tasks.length) * 100,
    );
  }

  protected isCompleted(task: Task): boolean {
    return task.status === 3;
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

    return new Intl.DateTimeFormat('pt-BR').format(
      new Date(date),
    );
  }

  protected trackByList(
    _: number,
    item: TaskListViewModel,
  ): string {
    return item.list.id;
  }

  private loadTaskLists(): void {
    this.loading.set(true);

    this.taskListsService.getAll().subscribe({
      next: (lists) => {
        this.taskLists.set(lists);

        this.selectedListIds.set(
          new Set(lists.map((list) => list.id)),
        );

        this.loadTasks(lists);
      },

      error: (error) => {
        this.loading.set(false);

        this.notificationService.error(
          error?.error?.message ??
            'Não foi possível carregar suas listas.',
        );
      },
    });
  }

  private loadTasks(lists: TaskList[]): void {
    if (lists.length === 0) {
      this.tasksByList.set([]);
      this.loading.set(false);

      return;
    }

    let completedRequests = 0;

    const result: TaskListViewModel[] = [];

    lists.forEach((list) => {
      this.tasksService.getByTaskListId(list.id).subscribe({
        next: (tasks) => {
          result.push({
            list,
            tasks,
          });

          completedRequests++;

          if (completedRequests === lists.length) {
            this.tasksByList.set(
              lists.map(
                (currentList) =>
                  result.find(
                    ({ list: resultList }) =>
                      resultList.id === currentList.id,
                  ) ?? {
                    list: currentList,
                    tasks: [],
                  },
              ),
            );

            this.loading.set(false);
          }
        },

        error: (error) => {
          completedRequests++;

          if (completedRequests === lists.length) {
            this.tasksByList.set(
              lists.map((currentList) => ({
                list: currentList,
                tasks:
                  result.find(
                    ({ list: resultList }) =>
                      resultList.id === currentList.id,
                  )?.tasks ?? [],
              })),
            );

            this.loading.set(false);
          }

          this.notificationService.error(
            error?.error?.message ??
              `Não foi possível carregar as tarefas da lista "${list.name}".`,
          );
        },
      });
    });
  }
}