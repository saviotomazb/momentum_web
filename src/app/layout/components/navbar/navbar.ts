import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
