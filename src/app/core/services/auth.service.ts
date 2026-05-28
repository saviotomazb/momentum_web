import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../constants/api.constants';

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokenKey = 'momentum_token';

  // Reactive state signals
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    this.loadToken();
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/api/auth/register`, { name, email, password })
      .pipe(tap((response) => this.handleAuthSuccess(response.token)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/api/auth/login`, { email, password })
      .pipe(tap((response) => this.handleAuthSuccess(response.token)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private handleAuthSuccess(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    const user = this.decodeToken(token);
    this.currentUser.set(user);
  }

  private loadToken(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // If token has expired, log user out
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          this.logout();
        } else {
          const user = this.decodeToken(token);
          this.currentUser.set(user);
        }
      } catch (e) {
        this.logout();
      }
    }
  }

  private decodeToken(token: string): User {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub || '',
      email: payload.email || '',
    };
  }
}
