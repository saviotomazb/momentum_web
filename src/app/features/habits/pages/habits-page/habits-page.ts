import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  CalendarDays,
  ChartBarIncreasing,
  CircleAlert,
  Flame,
  LucideAngularModule,
  Plus,
  RefreshCw,
} from 'lucide-angular';
import { finalize } from 'rxjs';

import { ToastService } from '../../../../core/services/toast.service';
import { AnalyticsChartComponent } from '../../../../shared/components/analytics-chart/analytics-chart';
import { HabitFormComponent } from '../../components/habit-form/habit-form';
import { HabitListComponent } from '../../components/habit-list/habit-list';
import { HabitFormValue } from '../../interfaces/habit-request.interface';
import { Habit } from '../../models/habit.model';
import { HabitsService } from '../../services/habits.service';

@Component({
  selector: 'app-habits-page',
  standalone: true,
  imports: [
    CommonModule,
    AnalyticsChartComponent,
    HabitFormComponent,
    HabitListComponent,
    LucideAngularModule,
  ],
  templateUrl: './habits-page.html',
})
export class HabitsPageComponent implements OnInit {
  private readonly habitsService = inject(HabitsService);
  private readonly toastService = inject(ToastService);

  protected readonly habits = signal<Habit[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly showForm = signal(false);
  protected readonly selectedHabit = signal<Habit | null>(null);
  protected readonly completingHabitId = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly icons = {
    calendar: CalendarDays,
    chart: ChartBarIncreasing,
    error: CircleAlert,
    flame: Flame,
    plus: Plus,
    refresh: RefreshCw,
  };

  protected readonly stats = computed(() => {
    const habits = this.habits();
    const totalHabits = habits.length;
    const completedToday = habits.filter((habit) => habit.completedToday).length;
    const bestStreak = habits.reduce((max, habit) => Math.max(max, habit.currentStreak), 0);
    const completionRate = totalHabits ? Math.round((completedToday / totalHabits) * 100) : 0;

    return {
      totalHabits,
      completedToday,
      bestStreak,
      completionRate,
    };
  });

  protected readonly streakChart = computed(() => {
    const habits = this.habits().slice(0, 8);
    return {
      labels: habits.map((habit) => habit.title),
      values: habits.map((habit) => habit.currentStreak),
    };
  });

  protected readonly completionsChart = computed(() => {
    const habits = this.habits().slice(0, 6);
    return {
      labels: habits.map((habit) => habit.title),
      values: habits.map((habit) => habit.totalCompletions),
    };
  });

  ngOnInit(): void {
    this.loadHabits();
  }

  protected loadHabits(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.habitsService
      .getAll()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (habits) => this.habits.set(habits),
        error: () => {
          const message = 'Nao foi possivel carregar seus habitos agora.';
          this.errorMessage.set(message);
          this.toastService.error(message);
        },
      });
  }

  protected openCreateForm(): void {
    this.selectedHabit.set(null);
    this.showForm.set(true);
  }

  protected openEditForm(habit: Habit): void {
    this.selectedHabit.set(habit);
    this.showForm.set(true);
  }

  protected closeForm(): void {
    this.selectedHabit.set(null);
    this.showForm.set(false);
  }

  protected saveHabit(payload: HabitFormValue): void {
    const habit = this.selectedHabit();
    const request$ = habit
      ? this.habitsService.update(habit.id, payload)
      : this.habitsService.create(payload);

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    request$.pipe(finalize(() => this.isSubmitting.set(false))).subscribe({
      next: (savedHabit) => {
        if (habit) {
          this.replaceHabit(savedHabit);
          this.toastService.success('Habito atualizado com sucesso.');
        } else {
          this.habits.update((habits) => [savedHabit, ...habits]);
          this.toastService.success('Habito criado com sucesso.');
        }
        this.closeForm();
      },
      error: () => {
        const message = 'Nao foi possivel salvar o habito.';
        this.errorMessage.set(message);
        this.toastService.error(message);
      },
    });
  }

  protected completeHabit(habit: Habit): void {
    if (habit.completedToday || this.completingHabitId()) {
      return;
    }

    const previousHabits = this.habits();
    const optimisticHabit: Habit = {
      ...habit,
      completedToday: true,
      currentStreak: habit.currentStreak + 1,
      totalCompletions: habit.totalCompletions + 1,
    };

    this.replaceHabit(optimisticHabit);
    this.completingHabitId.set(habit.id);
    this.errorMessage.set(null);

    this.habitsService
      .complete(habit.id)
      .pipe(finalize(() => this.completingHabitId.set(null)))
      .subscribe({
        next: (completedHabit) => {
          this.replaceHabit(completedHabit);
          this.toastService.success('Habito concluido hoje.');
        },
        error: () => {
          const message = 'Nao foi possivel concluir o habito. Tente novamente.';
          this.habits.set(previousHabits);
          this.errorMessage.set(message);
          this.toastService.error(message);
        },
      });
  }

  protected deleteHabit(habit: Habit): void {
    const previousHabits = this.habits();
    this.habits.update((habits) => habits.filter((item) => item.id !== habit.id));
    this.errorMessage.set(null);

    this.habitsService.delete(habit.id).subscribe({
      next: () => this.toastService.info('Habito excluido.'),
      error: () => {
        const message = 'Nao foi possivel excluir o habito.';
        this.habits.set(previousHabits);
        this.errorMessage.set(message);
        this.toastService.error(message);
      },
    });
  }

  private replaceHabit(updatedHabit: Habit): void {
    this.habits.update((habits) =>
      habits.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit)),
    );
  }
}
