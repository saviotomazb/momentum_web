import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../../core/constants/api.constants';
import { Category } from '../models/category.model';

export interface CreateCategoryRequest {
  name: string;
  color: string;
  icon: string;
}

export interface UpdateCategoryRequest {
  name: string;
  color: string;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly http = inject(HttpClient);

  private readonly endpoint = `${API_URL}/api/categories`;

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.endpoint);
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.endpoint}/${id}`);
  }

  create(request: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.endpoint, request);
  }

  update(id: string, request: UpdateCategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.endpoint}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}