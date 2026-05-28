import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Save, X } from 'lucide-angular';

import { HabitFormValue } from '../../interfaces/habit-request.interface';
import { Habit } from '../../models/habit.model';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './habit-form.html',
})
export class HabitFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() habit: Habit | null = null;
  @Input() submitting = false;

  @Output() saveHabit = new EventEmitter<HabitFormValue>();
  @Output() cancelForm = new EventEmitter<void>();

  protected readonly icons = {
    save: Save,
    x: X,
  };

  protected readonly frequencyOptions = [
    { value: 1, label: 'Diário' },
    { value: 2, label: 'Semanal' },
    { value: 3, label: 'Mensal' },
  ];

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    description: ['', [Validators.maxLength(240)]],
    frequency: [1, [Validators.required, Validators.min(1), Validators.max(3)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['habit']) {
      return;
    }

    if (this.habit) {
      this.form.reset({
        title: this.habit.title,
        description: this.habit.description ?? '',
        frequency: this.habit.frequency,
      });
      return;
    }

    this.form.reset({
      title: '',
      description: '',
      frequency: 1,
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saveHabit.emit({
      title: value.title.trim(),
      description: value.description.trim() || undefined,
      frequency: Number(value.frequency),
    });
  }

  protected isInvalid(fieldName: 'title' | 'description' | 'frequency'): boolean {
    const field = this.form.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }
}
