import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { GuideComponent } from './guide/guide.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
  { path: 'guide', component: GuideComponent },
];
