import {
  Injectable,
  inject,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Observable,
} from 'rxjs';

import {
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from '../models/task.model';

import {
  environment,
} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/tasks`;

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(
      this.apiUrl,
    );
  }

  getById(id: string): Observable<Task> {
    return this.http.get<Task>(
      `${this.apiUrl}/${id}`,
    );
  }

  getByTaskListId(
    taskListId: string,
  ): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrl}/list/${taskListId}`,
    );
  }

  create(
    data: CreateTaskRequest,
  ): Observable<Task> {
    return this.http.post<Task>(
      this.apiUrl,
      data,
    );
  }

  update(
    id: string,
    data: UpdateTaskRequest,
  ): Observable<Task> {
    return this.http.put<Task>(
      `${this.apiUrl}/${id}`,
      data,
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
    );
  }
}