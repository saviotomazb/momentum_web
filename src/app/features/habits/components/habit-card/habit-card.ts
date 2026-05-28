import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Check, Flame, LoaderCircle, LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';

import { Habit } from '../../models/habit.model';

@Component({
  selector: 'app-habit-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './habit-card.html',
})
export class HabitCardComponent {
  @Input({ required: true }) habit!: Habit;
  @Input() completing = false;

  @Output() completeHabit = new EventEmitter<Habit>();
  @Output() editHabit = new EventEmitter<Habit>();
  @Output() deleteHabit = new EventEmitter<Habit>();

  protected readonly icons = {
    check: Check,
    flame: Flame,
    loader: LoaderCircle,
    pencil: Pencil,
    trash: Trash2,
  };

  protected getFrequencyLabel(frequency: number): string {
    const labels: Record<number, string> = {
      1: 'Diário',
      2: 'Semanal',
      3: 'Mensal',
    };

    return labels[frequency] ?? 'Personalizado';
  }
}
