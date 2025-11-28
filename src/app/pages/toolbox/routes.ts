import { Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { ThreeViewComponent } from './threeview/3d-view.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: '3d-view', component: ThreeViewComponent },
  { path: 'users', component: UsersComponent },
  { path: 'about', component: AboutComponent }
];
