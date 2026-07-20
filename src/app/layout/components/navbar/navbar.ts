import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);

  readonly viewport = input<'mobile' | 'tablet' | 'desktop'>('desktop');

  @Output()
  readonly toggleSidebar = new EventEmitter<void>();

  protected onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}