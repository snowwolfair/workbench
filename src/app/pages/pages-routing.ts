import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { MapViewComponent } from './map-view/map-view.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { LayoutBlankComponent } from '../layout/blank/blank.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '',
    component: LayoutBlankComponent,
    data: {},
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'about',
        loadComponent: () => import('./about/about.component').then((m) => m.AboutComponent),
      },
      { path: 'users',
        loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent),
      },
      { path: 'map',
        loadComponent: () => import('./map-view/map-view.component').then((m) => m.MapViewComponent),
      },
      { path: 'workspace',
        loadComponent: () => import('./workspace/workspace.component').then((m) => m.WorkspaceComponent),
      },
    ]
  },
  { path: '**', component: DashboardComponent }
]; 