import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { API_URL } from '../../../core/constants/api.constants';
import { HabitRequest } from '../interfaces/habit-request.interface';
import { Habit, PagedResult } from '../models/habit.model';

@Injectable({
  providedIn: 'root',
})
export class HabitsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/api/habits`;

  getAll(): Observable<Habit[]> {
    return this.http
      .get<PagedResult<Habit>>(this.apiUrl)
      .pipe(map((response) => response.items));
  }

  getById(id: string): Observable<Habit> {
    return this.http.get<Habit>(`${this.apiUrl}/${id}`);
  }

  create(payload: HabitRequest): Observable<Habit> {
    return this.http.post<Habit>(this.apiUrl, payload);
  }

  update(id: string, payload: HabitRequest): Observable<Habit> {
    return this.http.put<Habit>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  complete(id: string): Observable<Habit> {
    return this.http.post<Habit>(`${this.apiUrl}/${id}/complete`, {});
  }
}
