import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withHashLocation,
  RouterFeatures,
  withViewTransitions
} from '@angular/router';
import { routes } from './pages/pages-routing';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { zh_CN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { ALAIN_CONFIG } from '@delon/util';
import { ALAIN_SETTING_KEYS } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { environment } from '@env/environment';

registerLocaleData(zh);

const routerFeatures: RouterFeatures[] = [
  withComponentInputBinding(),
  withViewTransitions(),
  withInMemoryScrolling({ scrollPositionRestoration: 'top' })
];
if (environment.useHash) routerFeatures.push(withHashLocation());

export const appConfig: ApplicationConfig = {
  

  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, ...routerFeatures),
    provideClientHydration(withEventReplay()),
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule),
    importProvidersFrom(NzModalModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: ALAIN_CONFIG,
      useValue: {
        page: {
          toTop: true,
          toTopOffset: 100
        },
        theme: {
          primary: '#1890ff'
        }
      }
    }
  ]
};
