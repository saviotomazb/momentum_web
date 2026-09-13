import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';

import { ErrorNotificationService } from '../../../core/services/error-notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly notificationService = inject(
    ErrorNotificationService,
  );

  remove(id: number): void {
    this.notificationService.remove(id);
  }
}