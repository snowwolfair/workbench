import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { SettingsService, User } from '@delon/theme';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


// rgba(24, 144, 255, 1);
@Component({
  selector: 'layout-blank',
  template: `
    <nz-layout>
      <nz-header>
        <div class="logo">
          <a routerLink="/dashboard">
            <img class="logimg" src="/assets/flower.svg" alt="Logo"/>
          </a>
        </div>
        @if(isSmallScreen){
          <ul nz-menu nzMode="horizontal" nzTheme="dark">
            <li nz-menu-item nzMatchRouter>
              <a routerLink="/dashboard">Dashboard</a>
            </li>
            <li nz-menu-item nzMatchRouter>
              <a routerLink="/tag-pool">标签池</a>
            </li>
            <li nz-menu-item nzMatchRouter>
              <a routerLink="/3d-view">3D视野</a>
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
        }
        <div class="avator">
          <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
            <nz-avatar [nzSrc]="user.avatar" nzSize="small" class="mr-sm"/>
            {{ user.name }}
          </div>
          <nz-dropdown-menu #userMenu="nzDropdownMenu">
            <div nz-menu class="width-sm">
              <div nz-menu-item routerLink="/pro/account/center">
                <i nz-icon nzType="close" class="mr-sm"></i>
                {{ 'menu.account.center'}}
              </div>
              <div nz-menu-item routerLink="/pro/account/settings">
                <i nz-icon nzType="setting" class="mr-sm"></i>
                {{ 'menu.account.settings'}}
              </div>
              <div nz-menu-item routerLink="/exception/trigger">
                <i nz-icon nzType="close-circle" class="mr-sm"></i>
                {{ 'menu.account.trigger'}}
              </div>
              <li nz-menu-divider></li>
              <div nz-menu-item (click)="logout()">
                <i nz-icon nzType="logout" class="mr-sm"></i>
                {{ 'menu.account.logout'}}
              </div>
            </div>
          </nz-dropdown-menu>
        </div>
      </nz-header>
      <nz-content>
        <router-outlet />
      </nz-content>
    </nz-layout>
  `,
  styles: [`
    .mr-sm {
      margin-right: 8px;
    }
    .width-sm {
      width: 160px;
    }
    .pd-sm {
      padding: 8px;
    }
    .alain-default__nav-item {
      display: flex;
      align-items: center;
    }
    .alain-default__nav-item:hover {
      cursor: pointer;
    }
    .logo {
      width: 64px;
      height: 64px;
      background: rgba(0, 0, 0, 1);
      margin: 16px 24px 16px 0;
      float: left;
      position: relative;
      flex: 0 1 auto;
    }
    .logimg {
      width: 100%;
      height: 32px;
    }
    .breadcrumb {
      margin: 10px 5px;
    }
    .avator {
      float: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-left: auto;
    }
    .ant-layout-header {
      height: 64px;
      padding: 0 5px;
      color: rgba(255, 255, 255, 1);
      line-height: 64px;
      background: rgba(0, 0, 0, 1);
      display: flex;
      align-items: center;
    }
  `],
  // host: {
  //   '[class.alain-blank]': 'true'
  // },
  imports: [
    RouterOutlet, 
    RouterLink, 
    NzMenuModule, 
    NzIconModule, 
    NzLayoutModule, 
    NzBreadCrumbModule, 
    NzDropDownModule,
    NzAvatarModule,
  ],
})
export class LayoutBlankComponent {
  private readonly settings = inject(SettingsService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private cdr = inject(ChangeDetectorRef);

  isSmallScreen = true;

  get user(): User {
    return this.settings.user;
  }
  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 800px)']).subscribe(result => {
      this.isSmallScreen = !result.matches;
      this.cdr.detectChanges();
    })
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url!);
  }
}
