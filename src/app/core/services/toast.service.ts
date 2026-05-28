import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly timeoutMs = 3600;
  readonly toasts = signal<Toast[]>([]);

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private show(message: string, type: ToastType): void {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    this.toasts.update((toasts) => [...toasts, { id, message, type }]);
    window.setTimeout(() => this.dismiss(id), this.timeoutMs);
  }
}
