import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { ErrorNotificationService } from '../../../../core/services/error-notification.service';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronRight,
  Info,
  LucideAngularModule,
  Save,
  type LucideIconData,
} from 'lucide-angular';

import { Category } from '../../models/category.model';
import {
  TransactionFrequency,
  TransactionType,
  UpdateTransactionRequest,
} from '../../models/transaction.model';
import { CategoriesService } from '../../services/categories.service';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-transaction-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  templateUrl: './transaction-edit.html',
})
export class TransactionEditComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categoriesService = inject(CategoriesService);
  private readonly transactionsService = inject(TransactionsService);
  private readonly notificationService = inject(
    ErrorNotificationService,
  );
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private transactionId = '';

  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);

  protected readonly transactionType = TransactionType;
  protected readonly transactionFrequency = TransactionFrequency;

  protected readonly icons = {
    arrowDown: ArrowDown,
    arrowLeft: ArrowLeft,
    arrowUp: ArrowUp,
    chevronRight: ChevronRight,
    info: Info,
    save: Save,
  };

  protected readonly form =
    this.formBuilder.nonNullable.group({
      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(200),
        ],
      ],
      amount: [
        0,
        [
          Validators.required,
          Validators.min(0.01),
        ],
      ],
      type: [
        TransactionType.Expense,
        Validators.required,
      ],
      frequency: [
        TransactionFrequency.OneTime,
        Validators.required,
      ],
      transactionDate: [
        this.getToday(),
        Validators.required,
      ],
      categoryId: [
        '',
        Validators.required,
      ],
    });

  constructor() {
    this.transactionId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.transactionId) {
      this.notificationService.error(
        'Não foi possível identificar a transação.',
      );

      this.router.navigate(['/finances/transactions']);
      return;
    }

    this.loadCategories();
    this.loadTransaction();
  }

  protected saveTransaction(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const request: UpdateTransactionRequest = {
      description: value.description.trim(),
      amount: value.amount,
      type: value.type,
      frequency: value.frequency,
      transactionDate: value.transactionDate,
      categoryId: value.categoryId,
    };

    this.saving.set(true);

    this.transactionsService
      .update(this.transactionId, request)
      .subscribe({
        next: () => {
          this.saving.set(false);

          this.router.navigate([
            '/finances/transactions',
          ]);
        },

        error: (error) => {
          this.notificationService.error(
            error.error.message,
          );

          this.saving.set(false);
        },
      });
  }

  protected onCancel(): void {
    this.router.navigate(['/finances/transactions']);
  }

  protected selectType(type: TransactionType): void {
    this.form.controls.type.setValue(type);
  }

  protected selectFrequency(
    frequency: TransactionFrequency,
  ): void {
    this.form.controls.frequency.setValue(frequency);
  }

  protected selectedTypeIcon(): LucideIconData {
    return this.form.controls.type.value ===
      TransactionType.Income
      ? ArrowUp
      : ArrowDown;
  }

  protected selectedCategoryName(): string {
    const categoryId =
      this.form.controls.categoryId.value;

    return (
      this.categories().find(
        (category) => category.id === categoryId,
      )?.name ?? 'Sem categoria'
    );
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  }

  protected get descriptionInvalid(): boolean {
    const control =
      this.form.controls.description;

    return control.invalid && control.touched;
  }

  protected get amountInvalid(): boolean {
    const control = this.form.controls.amount;

    return control.invalid && control.touched;
  }

  protected get categoryInvalid(): boolean {
    const control =
      this.form.controls.categoryId;

    return control.invalid && control.touched;
  }

  private loadTransaction(): void {
    this.transactionsService
      .getById(this.transactionId)
      .subscribe({
        next: (transaction) => {
          this.form.patchValue({
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            frequency: transaction.frequency,
            transactionDate:
              transaction.transactionDate,
            categoryId: transaction.categoryId,
          });

          this.loading.set(false);
        },

        error: (error) => {
          this.notificationService.error(
            error.error.message,
          );

          this.loading.set(false);

          this.router.navigate([
            '/finances/transactions',
          ]);
        },
      });
  }

  private loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },

      error: (error) => {
        this.notificationService.error(
          error.error.message,
        );
      },
    });
  }

  private getToday(): string {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
      today.getDate(),
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}