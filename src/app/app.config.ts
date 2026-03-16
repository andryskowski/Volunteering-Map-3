import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './components/interceptors/loader.interceptor';
import { authInterceptor } from './components/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([loaderInterceptor, authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
