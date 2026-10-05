import { Component, computed, inject, signal } from '@angular/core';

import { RouterLink } from '@angular/router';

import { ErrorNotificationService } from '../../../core/services/error-notification.service';

import { Task, TaskStatus } from '../models/task.model';

import { TaskList } from '../models/task-list.model';

import { Subtask } from '../models/subtask.model';

import { TaskListsService } from '../services/task-lists.service';

import { TasksService } from '../services/tasks.service';

import { SubtasksService } from '../services/subtasks.service';

interface TaskListViewModel {
  list: TaskList;
  tasks: Task[];
  subtasksByTask: Record<string, Subtask[]>;
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
  private readonly subtasksService = inject(SubtasksService);

  private readonly notificationService = inject(
    ErrorNotificationService,
  );

  protected readonly taskLists = signal<TaskList[]>([]);
  protected readonly tasksByList = signal<TaskListViewModel[]>([]);
  protected readonly selectedListIds = signal<Set<string>>(new Set());
  protected readonly loading = signal(true);

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

  protected getPendingTasks(tasks: Task[]): Task[] {
    return tasks.filter((task) => !this.isCompleted(task));
  }

  protected getCompletedTasks(tasks: Task[]): Task[] {
    return tasks.filter((task) => this.isCompleted(task));
  }

  protected getCompletedCount(tasks: Task[]): number {
    return this.getCompletedTasks(tasks).length;
  }

  protected getCompletedSubtaskCount(subtasks: Subtask[]): number {
    return subtasks.filter((subtask) =>
      this.isSubtaskCompleted(subtask),
    ).length;
  }

  protected getProgress(tasks: Task[]): number {
    if (tasks.length === 0) {
      return 0;
    }

    return Math.round(
      (this.getCompletedCount(tasks) / tasks.length) * 100,
    );
  }

  protected getSubtaskProgress(subtasks: Subtask[]): number {
    if (subtasks.length === 0) {
      return 0;
    }

    const completedCount = subtasks.filter((subtask) =>
      this.isSubtaskCompleted(subtask),
    ).length;

    return Math.round((completedCount / subtasks.length) * 100);
  }

  protected isCompleted(task: Task): boolean {
    return task.status === TaskStatus.Completed;
  }

  protected isSubtaskCompleted(subtask: Subtask): boolean {
    return subtask.status === TaskStatus.Completed;
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

      error: () => {
        this.loading.set(false);

        this.notificationService.error(
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
          if (tasks.length === 0) {
            result.push({
              list,
              tasks,
              subtasksByTask: {},
            });

            completedRequests++;

            if (completedRequests === lists.length) {
              this.setTasksByList(lists, result);
            }

            return;
          }

          let completedSubtaskRequests = 0;

          const subtasksByTask: Record<string, Subtask[]> = {};

          tasks.forEach((task) => {
            this.subtasksService
              .getAllByTaskId(task.id)
              .subscribe({
                next: (subtasks) => {
                  subtasksByTask[task.id] = subtasks;

                  completedSubtaskRequests++;

                  if (
                    completedSubtaskRequests === tasks.length
                  ) {
                    result.push({
                      list,
                      tasks,
                      subtasksByTask,
                    });

                    completedRequests++;

                    if (
                      completedRequests === lists.length
                    ) {
                      this.setTasksByList(lists, result);
                    }
                  }
                },

                error: () => {
                  subtasksByTask[task.id] = [];

                  completedSubtaskRequests++;

                  if (
                    completedSubtaskRequests === tasks.length
                  ) {
                    result.push({
                      list,
                      tasks,
                      subtasksByTask,
                    });

                    completedRequests++;

                    if (
                      completedRequests === lists.length
                    ) {
                      this.setTasksByList(lists, result);
                    }
                  }

                  this.notificationService.error(
                    `Não foi possível carregar as subtarefas da tarefa "${task.title}".`,
                  );
                },
              });
          });
        },

        error: () => {
          completedRequests++;

          if (completedRequests === lists.length) {
            this.setTasksByList(lists, result);
          }

          this.notificationService.error(
            `Não foi possível carregar as tarefas da lista "${list.name}".`,
          );
        },
      });
    });
  }

  private setTasksByList(
    lists: TaskList[],
    result: TaskListViewModel[],
  ): void {
    this.tasksByList.set(
      lists.map(
        (currentList) =>
          result.find(
            ({ list: resultList }) =>
              resultList.id === currentList.id,
          ) ?? {
            list: currentList,
            tasks: [],
            subtasksByTask: {},
          },
      ),
    );

    this.loading.set(false);
  }

  private updateSubtaskInState(updatedSubtask: Subtask): void {
    this.tasksByList.update((viewModels) =>
      viewModels.map((viewModel) => {
        const subtasks =
          viewModel.subtasksByTask[updatedSubtask.taskId];

        if (!subtasks) {
          return viewModel;
        }

        return {
          ...viewModel,

          subtasksByTask: {
            ...viewModel.subtasksByTask,

            [updatedSubtask.taskId]: subtasks.map((subtask) =>
              subtask.id === updatedSubtask.id
                ? updatedSubtask
                : subtask,
            ),
          },
        };
      }),
    );
  }

  protected toggleSubtask(subtask: Subtask): void {
    const status = this.isSubtaskCompleted(subtask)
      ? TaskStatus.Pending
      : TaskStatus.Completed;

    this.subtasksService
      .update(subtask.id, {
        title: subtask.title,
        description: subtask.description,
        status,
        priority: subtask.priority,
        scheduledDate: subtask.scheduledDate,
        dueDate: subtask.dueDate,
      })
      .subscribe({
        next: (updatedSubtask) => {
          this.updateSubtaskInState(updatedSubtask);
        },

        error: () => {
          this.notificationService.error(
            `Não foi possível atualizar a subtarefa "${subtask.title}".`,
          );
        },
      });
  }
}