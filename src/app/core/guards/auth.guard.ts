import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: Controllando l\'autenticazione per:', state.url);
  
  const token = authService.getToken();
  console.log('AuthGuard: Token presente?', !!token);
  
  if (!token) {
    console.log('AuthGuard: Nessun token, reindirizzamento al login');
    return router.createUrlTree(['/login']);
  }

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      console.log('AuthGuard: isLoggedIn dal BehaviorSubject:', isLoggedIn);
      if (isLoggedIn) {
        console.log('AuthGuard: Accesso consentito a:', state.url);
        return true;
      }
      console.log('AuthGuard: Accesso negato, reindirizzamento al login');
      return router.createUrlTree(['/login']);
    })
  );
};