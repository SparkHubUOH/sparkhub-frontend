import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { TranslateService } from './app/services/translation/translation';
import { 
    TranslateHttpLoader, 
    TRANSLATE_HTTP_LOADER_CONFIG 
} from '@ngx-translate/http-loader'; 

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ts: TranslateService) => () => (ts as any).initLanguage?.(),
      deps: [TranslateService],
      multi: true
    },
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/', 
        suffix: '.json'
      }
    },

    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader,
          deps: [HttpClient]
        },
        defaultLanguage: 'en', 
      }),
    ),
  ]
}).catch(err => console.error(err));