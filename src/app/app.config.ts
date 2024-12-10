import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation, withViewTransitions } from '@angular/router';
import { provideNzConfig } from 'ng-zorro-antd/core/config';

import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptorHttpService } from './core/interceptors/api.interceptor';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes, withViewTransitions(), withComponentInputBinding(), withHashLocation()),
		provideNzIcons(),
		provideNzI18n(es_ES),
		importProvidersFrom(FormsModule),
		provideAnimationsAsync(),
		provideNzConfig({
			message: {
				nzTop: 24,
				nzDuration: 3000,
				nzMaxStack: 7,
				nzPauseOnHover: true,
				nzAnimate: true,
				nzDirection: 'ltr',
			},
		}),
		provideHttpClient(withInterceptors([AuthInterceptorHttpService])),
	],
};

// mysql-c79f8f8
