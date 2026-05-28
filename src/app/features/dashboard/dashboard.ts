import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsChartComponent } from '../../shared/components/analytics-chart/analytics-chart';
import { AuthService } from '../../core/services/auth.service';
import { Habit } from '../habits/models/habit.model';
import { HabitsService } from '../habits/services/habits.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AnalyticsChartComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly habitsService = inject(HabitsService);

  protected readonly habits = signal<Habit[]>([]);
  protected readonly isLoading = signal(true);

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

  protected readonly weeklyChart = computed(() => {
    const rate = this.stats().completionRate;
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: rate
        ? [
            Math.max(8, rate - 24),
            Math.max(8, rate - 18),
            rate,
            Math.min(100, rate + 10),
            Math.max(8, rate - 8),
            Math.max(8, rate - 20),
            Math.max(8, rate - 28),
          ]
        : [0, 0, 0, 0, 0, 0, 0],
    };
  });

  protected readonly streakChart = computed(() => {
    const habits = this.habits().slice(0, 6);
    return {
      labels: habits.map((habit) => habit.title),
      values: habits.map((habit) => habit.currentStreak),
    };
  });

  ngOnInit(): void {
    this.habitsService.getAll().subscribe({
      next: (habits) => {
        this.habits.set(habits);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  getUserGreeting(): string {
    const user = this.authService.currentUser();
    if (!user) return 'Visitante';
    const emailPrefix = user.email.split('@')[0];
    return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  }
}
