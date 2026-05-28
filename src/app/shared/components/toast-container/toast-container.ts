import { Component, inject } from '@angular/core';
import { Check, CircleAlert, Info, LucideAngularModule, X } from 'lucide-angular';

import { ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './toast-container.html',
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);

  protected readonly icons = {
    check: Check,
    error: CircleAlert,
    info: Info,
    close: X,
  };

  protected iconFor(type: ToastType) {
    if (type === 'success') return this.icons.check;
    if (type === 'error') return this.icons.error;
    return this.icons.info;
  }

  protected classesFor(type: ToastType): string {
    if (type === 'success') return 'border-success/25 bg-green-50 text-success';
    if (type === 'error') return 'border-red-200 bg-red-50 text-red-700';
    return 'border-brand-blue/25 bg-brand-blue-soft text-brand-blue';
  }
}
