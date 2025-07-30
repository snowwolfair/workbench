import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { pagesRoutes } from './pages/pages-routing';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { zh_CN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { ALAIN_CONFIG } from '@delon/util';

registerLocaleData(zh);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(pagesRoutes),
    provideClientHydration(withEventReplay()),
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule),
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
