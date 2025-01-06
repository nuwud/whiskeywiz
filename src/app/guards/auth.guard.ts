import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      catchError(error => {
        console.error('Auth Error:', error);
        return of(false);
      }),
      tap(isAuth => {
        if (!isAuth) {
          // Store attempted URL for redirect after login
          this.authService.redirectUrl = state.url;
          this.router.navigate(['/login']);
        }
      })
    );
  }
}

export const canActivateAuth: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated().pipe(
    catchError(error => {
      console.error('Auth Error:', error);
      return of(false);
    }),
    tap(isAuth => {
      if (!isAuth) {
        authService.redirectUrl = state.url;
        router.navigate(['/login']);
      }
    })
  );
};

export const canActivateAdmin: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAdmin().pipe(
    catchError(error => {
      console.error('Admin Auth Error:', error);
      return of(false);
    }),
    tap(isAdmin => {
      if (!isAdmin) {
        router.navigate(['/unauthorized']);
      }
    })
  );
};

export const canActivateGame: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    catchError(error => {
      console.error('Game Auth Error:', error);
      return of(false);
    }),
    tap(isAuth => {
      if (!isAuth) {
        authService.redirectUrl = state.url;
        router.navigate(['/login']);
      }
    })
  );
};

// FOR_CLAUDE: Updated auth guards with proper error handling and navigation state management