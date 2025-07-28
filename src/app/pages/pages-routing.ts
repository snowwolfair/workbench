import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { MapViewComponent } from './map-view/map-view.component';
import { WorkspaceComponent } from './workspace/workspace.component';

export const pagesRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'about', component: AboutComponent },
  { path: 'users', component: UsersComponent },
  { path: 'map', component: MapViewComponent },
  { path: 'workspace', component: WorkspaceComponent },
  { path: '**', redirectTo: 'login' }
]; 