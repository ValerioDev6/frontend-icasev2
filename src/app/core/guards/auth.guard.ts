import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';
import { AuthService } from '../services/common/auth.service';

export const isLoggedGuard: CanActivateFn = () => {

  const router: Router = inject(Router);

  return inject(AuthService).isLoggedIn$.pipe(
    map((isLoggedIn) => isLoggedIn || router.createUrlTree(['/auth/login']))
  );
};

export const isntLoggedGuard: CanActivateFn = () => {

  const router: Router = inject(Router);
  return inject(AuthService).isLoggedIn$.pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          return router.createUrlTree(['/admin/dashboard']);
        }
        return true;
      }
    )
  );
};
