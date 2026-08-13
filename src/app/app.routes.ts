import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then((m) => m.RegisterComponent),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/components/shell/shell').then((m) => m.ShellComponent),
    children: [
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/pages/tasks').then((m) => m.TasksComponent),
      },
      {
        path: 'habits',
        loadComponent: () =>
          import('./features/habits/pages/habits-page/habits-page').then(
            (m) => m.HabitsPageComponent,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard').then((m) => m.DashboardComponent),
      },

      {
        path: 'finances',
        children: [
          {
            path: 'overview',
            loadComponent: () =>
              import('./features/finances/pages/overview/overview').then(
                (m) => m.OverviewComponent,
              ),
          },
          {
            path: 'transactions',
            loadComponent: () =>
              import('./features/finances/pages/transactions/transactions').then(
                (m) => m.TransactionsComponent,
              ),
          },
          {
            path: 'categories',
            loadComponent: () =>
              import('./features/finances/pages/categories/categories').then(
                (m) => m.CategoriesComponent,
              ),
          },
        ],
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
