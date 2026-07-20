import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { SidebarComponent } from '../sidebar/sidebar';

type Viewport = 'mobile' | 'tablet' | 'desktop';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './shell.html',
})
export class ShellComponent {
  protected readonly viewport = signal<Viewport>('desktop');

  protected readonly sidebarCollapsed = signal(false);

  protected readonly sidebarOpen = signal(false);

  constructor() {
    this.updateViewport();
  }

  protected toggleSidebar(): void {
    if (this.viewport() === 'desktop') {
      this.sidebarCollapsed.update(value => !value);
      return;
    }

    this.sidebarOpen.update(value => !value);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.updateViewport();
  }

  private updateViewport(): void {
    const width = window.innerWidth;

    if (width < 768) {
      this.viewport.set('mobile');
      this.sidebarOpen.set(false);
    } else if (width < 1024) {
      this.viewport.set('tablet');
      this.sidebarOpen.set(false);
    } else {
      this.viewport.set('desktop');
      this.sidebarOpen.set(false);
    }
  }
}