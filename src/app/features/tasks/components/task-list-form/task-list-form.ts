import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ErrorNotificationService } from '../../../../core/services/error-notification.service';
import { TaskListsService } from '../../services/task-lists.service';

@Component({
  selector: 'app-task-list-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-list-form.html',
})
export class TaskListFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly taskListsService = inject(TaskListsService);
  private readonly notificationService = inject(ErrorNotificationService);

  protected readonly listId = this.route.snapshot.paramMap.get('id');
  protected readonly isEditing = !!this.listId;
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  constructor() {
    if (this.listId) {
      this.loadList(this.listId);
    }
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.form.controls.name.value.trim();

    if (!name) {
      this.form.controls.name.setErrors({ required: true });
      return;
    }

    this.saving.set(true);

    const request = { name };

    const operation = this.listId
      ? this.taskListsService.update(this.listId, request)
      : this.taskListsService.create(request);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.saving.set(false);
        this.notificationService.error(
          this.isEditing
            ? 'Não foi possível atualizar a lista.'
            : 'Não foi possível criar a lista.',
        );
      },
    });
  }

  private loadList(id: string): void {
    this.loading.set(true);

    this.taskListsService.getById(id).subscribe({
      next: (list) => {
        this.form.patchValue({ name: list.name });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error(
          'Não foi possível carregar a lista.',
        );
        this.router.navigate(['/tasks']);
      },
    });
  }
}