import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'layout-blank',
  template: `
    <nz-layout>
      <nz-header>
        <div class="logo">
          <a routerLink="/dashboard">
            <img class="logimg" src="/assets/logo.svg" alt="Logo"/>
          </a>
        </div>
        <ul nz-menu nzMode="horizontal" nzTheme="dark">
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/dashboard">Dashboard</a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/about">关于</a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/users">用户列表</a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/map">地图</a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/workspace">工作区</a>
          </li>
        </ul>
      </nz-header>
      <nz-content>
        <router-outlet />
      </nz-content>
    </nz-layout>
  `,
  styles: [`
    .logo {
      width: 120px;
      height: 64px;
      background: rgba(0, 0, 0, 0.2);
      margin: 16px 24px 16px 0;
      float: left;
      position: relative;
      flex: 0 1 auto;
    }
    .logimg {
      width: 100%;
      height: 64px;
    }
    .ant-layout-header {
      height: 64px;
      padding: 0 5px;
      color: rgba(255, 255, 255, 0.85);
      line-height: 64px;
      background: #000000ff;
      display: flex;
      align-items: center;
    }
  `],
  // host: {
  //   '[class.alain-blank]': 'true'
  // },
  imports: [RouterOutlet, RouterLink, NzMenuModule, NzIconModule, NzLayoutModule, NzBreadCrumbModule]
})
export class LayoutBlankComponent {}
