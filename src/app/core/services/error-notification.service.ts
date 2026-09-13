import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorNotificationService {
  show(message: string): void {
    console.error(message);
  }
}