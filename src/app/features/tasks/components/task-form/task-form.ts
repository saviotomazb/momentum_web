
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ErrorNotificationService } from '../../../../core/services/error-notification.service';
import {
  TaskPriority,
  TaskStatus,
} from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
})
export class TaskFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tasksService = inject(TasksService);
  private readonly notificationService = inject(
    ErrorNotificationService,
  );

  protected readonly taskId =
    this.route.snapshot.paramMap.get('id');

  protected readonly listId =
    this.route.snapshot.paramMap.get('listId');

  protected readonly isEditing = !!this.taskId;
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);

  protected readonly TaskStatus = TaskStatus;
  protected readonly TaskPriority = TaskPriority;

  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
    status: [TaskStatus.Pending],
    priority: [TaskPriority.Medium],
    scheduledDate: ['', [Validators.pattern(/^\d{2}-\d{2}-\d{4}$/)]],
    dueDate: ['', [Validators.pattern(/^\d{2}-\d{2}-\d{4}$/)]],
  });

  constructor() {
    if (this.taskId) {
      this.loadTask(this.taskId);
    } else if (!this.listId) {
      this.router.navigate(['/tasks']);
    }
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    const title = values.title.trim();

    if (!title) {
      this.form.controls.title.setErrors({ required: true });
      return;
    }

    const scheduledDate = this.toApiDate(values.scheduledDate);
    const dueDate = this.toApiDate(values.dueDate);

    if (
      (values.scheduledDate && !scheduledDate) ||
      (values.dueDate && !dueDate)
    ) {
      this.notificationService.error(
        'Informe datas válidas no formato dd-MM-yyyy.',
      );
      return;
    }

    this.saving.set(true);

    const fields = {
      title,
      description: values.description.trim() || null,
      status: values.status,
      priority: values.priority,
      scheduledDate,
      dueDate,
    };

    const operation = this.taskId
      ? this.tasksService.update(this.taskId, fields)
      : this.tasksService.create({
          taskListId: this.listId!,
          ...fields,
        });

    operation.subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.saving.set(false);
        this.notificationService.error(
          this.isEditing
            ? 'Não foi possível atualizar a tarefa.'
            : 'Não foi possível criar a tarefa.',
        );
      },
    });
  }

  private loadTask(id: string): void {
    this.loading.set(true);

    this.tasksService.getById(id).subscribe({
      next: (task) => {
        this.form.patchValue({
          title: task.title,
          description: task.description ?? '',
          status: task.status,
          priority: task.priority,
          scheduledDate: this.toDisplayDate(task.scheduledDate),
          dueDate: this.toDisplayDate(task.dueDate),
        });

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error(
          'Não foi possível carregar a tarefa.',
        );
        this.router.navigate(['/tasks']);
      },
    });
  }

  private toDisplayDate(value: string | null): string {
    if (!value) {
      return '';
    }

    const isoDate = value.substring(0, 10);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);

    if (!match) {
      return '';
    }

    return `${match[3]}-${match[2]}-${match[1]}`;
  }

  private toApiDate(value: string): string | null {
    if (!value) {
      return null;
    }

    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);

    if (!match) {
      return null;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return null;
    }

    return `${match[3]}-${match[2]}-${match[1]}`;
  }
}