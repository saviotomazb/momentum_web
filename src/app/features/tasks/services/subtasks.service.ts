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
  CreateSubtaskRequest,
  Subtask,
  UpdateSubtaskRequest,
} from '../models/subtask.model';

import {
  environment,
} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubtasksService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/subtasks`;

  getById(id: string): Observable<Subtask> {
    return this.http.get<Subtask>(
      `${this.apiUrl}/${id}`,
    );
  }

  getAllByTaskId(
    taskId: string,
  ): Observable<Subtask[]> {
    return this.http.get<Subtask[]>(
      `${this.apiUrl}/task/${taskId}`,
    );
  }

  create(
    data: CreateSubtaskRequest,
  ): Observable<Subtask> {
    return this.http.post<Subtask>(
      this.apiUrl,
      data,
    );
  }

  update(
    id: string,
    data: UpdateSubtaskRequest,
  ): Observable<Subtask> {
    return this.http.put<Subtask>(
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