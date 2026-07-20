import { Component, inject, input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);

  readonly viewport = input<'mobile' | 'tablet' | 'desktop'>('desktop');

  readonly collapsed = input(false);

  readonly opened = input(false);

  @Output()
  readonly navigate = new EventEmitter<void>();

  protected onNavigate(): void {
    if (this.viewport() !== 'desktop') {
      this.navigate.emit();
    }
  }
}