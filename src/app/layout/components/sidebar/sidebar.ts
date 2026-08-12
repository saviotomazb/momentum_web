import { Component, EventEmitter, Output, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  ListTodo,
  LucideAngularModule,
  Settings,
  Target,
  WalletCards,
  type LucideIconData,
} from 'lucide-angular';

interface SidebarChildItem {
  label: string;
  path: string;
}

interface SidebarItem {
  label: string;
  path?: string;
  icon: LucideIconData;
  children?: SidebarChildItem[];
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  readonly viewport = input<'mobile' | 'tablet' | 'desktop'>('desktop');

  readonly collapsed = input(false);

  readonly opened = input(false);

  readonly financesExpanded = signal(false);

  @Output()
  readonly navigate = new EventEmitter<void>();

  protected readonly icons = {
    chevron: ChevronDown,
  };

  protected readonly sections: SidebarSection[] = [
    {
      title: 'Principal',
      items: [
        {
          label: 'Visão geral',
          path: '/overview',
          icon: LayoutDashboard,
        },
        {
          label: 'Tarefas',
          path: '/tasks',
          icon: ListTodo,
        },
        {
          label: 'Hábitos',
          path: '/habits',
          icon: Target,
        },
        {
          label: 'Finanças',
          icon: WalletCards,
          children: [
            {
              label: 'Visão geral',
              path: '/finances',
            },
            {
              label: 'Transações',
              path: '/finances/transactions',
            },
            {
              label: 'Categorias',
              path: '/finances/categories',
            },
          ],
        },
      ],
    },
    {
      title: 'Planejamento',
      items: [
        {
          label: 'Calendário',
          path: '/calendar',
          icon: CalendarDays,
        },
        {
          label: 'Relatórios',
          path: '/reports',
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'Configurações',
      items: [
        {
          label: 'Configurações',
          path: '/settings',
          icon: Settings,
        },
        {
          label: 'Ajuda',
          path: '/help',
          icon: CircleHelp,
        },
      ],
    },
  ];

  protected onNavigate(): void {
    if (this.viewport() !== 'desktop') {
      this.navigate.emit();
    }
  }

  protected toggleFinances(): void {
    this.financesExpanded.update(value => !value);
  }
}
