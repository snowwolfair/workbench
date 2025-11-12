import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { MapViewComponent } from './map-view/map-view.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { LayoutBlankComponent } from '../layout/blank/blank.component';
import { TagPoolComponent } from './litematica/tag-pool/tag-pool.component';
import { ThreeViewComponent } from './threeview/3d-view.component';
import { HomeComponent } from './home/home.component';
import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';
import { startPageGuard } from '@core';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: '首页' },
  // passport
  { path: 'passport', loadChildren: () => import('./passport/routes').then(m => m.routes) },
  {
    path: 'workbench',
    component: LayoutBlankComponent,
    canActivate: [startPageGuard, authSimpleCanActivate],
    canActivateChild: [authSimpleCanActivateChild],
    data: {
      breadcrumb: '首页'
    },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/routes').then(m => m.routes),
        data: {
          breadcrumb: '首页'
        }
      },
      {
        path: '3d-view',
        loadComponent: () => import('./threeview/3d-view.component').then(m => m.ThreeViewComponent),
        data: {
          breadcrumb: '3D视野'
        }
      },
      {
        path: 'about',
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent),
        data: {
          breadcrumb: '关于'
        }
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
        data: {
          breadcrumb: '用户列表'
        }
      },
      {
        path: 'map',
        loadComponent: () => import('./map-view/map-view.component').then(m => m.MapViewComponent),
        data: {
          breadcrumb: '地图'
        }
      },
      {
        path: 'workspace',
        loadComponent: () => import('./workspace/workspace.component').then(m => m.WorkspaceComponent),
        data: {
          breadcrumb: '工作区'
        }
      }
    ]
  },

  //先导页
  { path: '**', redirectTo: 'exception/404' }
];
