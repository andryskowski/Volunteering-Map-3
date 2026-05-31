import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './components/interceptors/loader.interceptor';
import { authInterceptor } from './components/interceptors/auth-interceptor';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { PlacesEffects } from './store/places/places.effects';
import { placesReducer } from './store/places/places.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({
      places: placesReducer,
    }),
    provideEffects(PlacesEffects),
    provideHttpClient(withInterceptors([loaderInterceptor, authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
