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
  CreateTaskListRequest,
  TaskList,
  UpdateTaskListRequest,
} from '../models/task-list.model';

import {
  environment,
} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskListsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/task-lists`;

  getAll(): Observable<TaskList[]> {
    return this.http.get<TaskList[]>(
      this.apiUrl,
    );
  }

  getById(id: string): Observable<TaskList> {
    return this.http.get<TaskList>(
      `${this.apiUrl}/${id}`,
    );
  }

  create(
    data: CreateTaskListRequest,
  ): Observable<TaskList> {
    return this.http.post<TaskList>(
      this.apiUrl,
      data,
    );
  }

  update(
    id: string,
    data: UpdateTaskListRequest,
  ): Observable<TaskList> {
    return this.http.put<TaskList>(
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