import { Routes } from '@angular/router';
import { startPageGuard } from '@core';
import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';

import { HomeComponent } from './home/home.component';
import { LayoutBlankComponent } from '../layout/blank/blank.component';

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
        loadComponent: () => import('./toolbox/threeview/3d-view.component').then(m => m.ThreeViewComponent),
        data: {
          breadcrumb: '3D视野'
        }
      },
      {
        path: 'about',
        loadComponent: () => import('./toolbox/about/about.component').then(m => m.AboutComponent),
        data: {
          breadcrumb: '关于'
        }
      },
      {
        path: 'users',
        loadComponent: () => import('./toolbox/users/users.component').then(m => m.UsersComponent),
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
      },
      {
        path: 'toolbox',
        loadChildren: () => import('./toolbox/routes').then(m => m.routes),
        data: {
          breadcrumb: '工具箱'
        }
      }
    ]
  }
  //先导页
  // { path: 'exception', loadChildren: () => import('./exception/routes').then(m => m.routes) },
  // { path: '**', redirectTo: 'exception/404' }
];
