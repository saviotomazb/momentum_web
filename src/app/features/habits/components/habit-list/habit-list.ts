import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { HabitCardComponent } from '../habit-card/habit-card';
import { Habit } from '../../models/habit.model';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [CommonModule, HabitCardComponent],
  templateUrl: './habit-list.html',
})
export class HabitListComponent {
  @Input({ required: true }) habits: Habit[] = [];
  @Input() completingHabitId: string | null = null;

  @Output() completeHabit = new EventEmitter<Habit>();
  @Output() editHabit = new EventEmitter<Habit>();
  @Output() deleteHabit = new EventEmitter<Habit>();
}
