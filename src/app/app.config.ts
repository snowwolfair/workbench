import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideMockConfig } from '@delon/mock';
import * as MOCKDATA from '@_mock';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withHashLocation,
  RouterFeatures,
  withViewTransitions,
} from '@angular/router';
import { routes } from './pages/pages-routing';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { default as ngLang } from '@angular/common/locales/zh';
import { zh_CN as zorroLang, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { zhCN as dateLang } from 'date-fns/locale';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ALAIN_CONFIG } from '@delon/util';
import { ALAIN_SETTING_KEYS, provideAlain, zh_CN as delonLang, AlainProvideLang  } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { environment } from '@env/environment';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MockRequest } from '@delon/mock';
import { authSimpleInterceptor, provideAuth } from '@delon/auth';
import { I18NService, defaultInterceptor, provideBindAuthRefresh, provideStartup } from '@core';
import { AlainConfig } from '@delon/util/config';
import { ICONS } from '../style-icons';
import { ICONS_AUTO } from '../style-icons-auto';


registerLocaleData(zh);

const defaultLang: AlainProvideLang = {
  abbr: 'zh-CN',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang
};

const alainConfig: AlainConfig = {
  st: { modal: { size: 'lg' } },
  pageHeader: { homeI18n: 'home' },
  lodop: {
    license: `A59B099A586B3851E0F0D7FDBF37B603`,
    licenseA: `C94CEE276DB2187AE6B65D56B3FC2848`
  },
  auth: { login_url: '/passport/login' }
};

const routerFeatures: RouterFeatures[] = [
  withComponentInputBinding(),
  withViewTransitions(),
  withInMemoryScrolling({ scrollPositionRestoration: 'top'})
];
if (environment.useHash) routerFeatures.push(withHashLocation());



export const appConfig: ApplicationConfig = {

  providers: [
    provideMockConfig({ data: MOCKDATA }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, ...routerFeatures),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(FormsModule),
    importProvidersFrom(NzModalModule),
    importProvidersFrom(NzIconModule),
    provideAlain({config: alainConfig,defaultLang, i18nClass: I18NService,icons: [...ICONS_AUTO, ...ICONS]}),

    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([...(environment.interceptorFns ?? []), authSimpleInterceptor, defaultInterceptor])),
    provideStartup(),
    ...(environment.providers || [])
  ]
  
};