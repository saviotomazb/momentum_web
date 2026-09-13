import { Injectable, signal } from '@angular/core';

import { Toast } from '../interfaces/toast.interface';

@Injectable({
  providedIn: 'root',
})
export class ErrorNotificationService {
  private nextToastId = 0;

  readonly toasts = signal<Toast[]>([]);

  show(
    message: string,
    type: Toast['type'] = 'error',
  ): void {
    const toast: Toast = {
      id: this.nextToastId++,
      message,
      type,
    };

    this.toasts.update((toasts) => [
      ...toasts,
      toast,
    ]);

    setTimeout(() => {
      this.remove(toast.id);
    }, 5000);
  }

  remove(id: number): void {
    this.toasts.update((toasts) =>
      toasts.filter((toast) => toast.id !== id),
    );
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }
}