import { CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { Injector, inject } from '@angular/core';

/**
 * Dynamically load the start page
 *
 * 动态加载启动页
 */
export const startPageGuard: CanActivateFn = (): boolean | Observable<boolean> => {
  // Re-jump according to the first item of the menu, you can re-customize the logic
  // 以下代码是根据菜单的第一项进行重新跳转，你可以重新定制逻辑
  // const menuSrv = inject(MenuService);
  // if (menuSrv.find({ url: state.url }) == null) {
  //   inject(Router).navigateByUrl(menuSrv.menus[0].link!);
  //   return false;
  // }

  // const user = inject(DA_SERVICE_TOKEN).get(); //  get() 返回保存的用户信息
  // if (!user || !user.expired) {
  //   return false; // 没有用户信息或没有过期时间，默认视为过期
  // }
  // return Date.now() < user.expired;
  return true;
};
