import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {
  protected readonly authService = inject(AuthService);

  getUserGreeting(): string {
    const user = this.authService.currentUser();
    if (!user) return 'Visitante';
    const emailPrefix = user.email.split('@')[0];
    return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  }
}
