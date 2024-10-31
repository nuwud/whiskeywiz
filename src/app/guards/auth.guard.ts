// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, from, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const canActivateAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};

export const canActivateGame: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.getPlayerId().pipe(
    map(playerId => {
      if (playerId) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};

export const canActivateAdmin: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin().pipe(
    map(isAdmin => {
      if (isAdmin) {
        return true;
      }
      router.navigate(['/unauthorized']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
};

export const combineGuards = (...guards: CanActivateFn[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    Observable<boolean | UrlTree> => {
    const observables = guards.map(guard => {
      const result = guard(route, state);
      if (result instanceof Observable) {
        return result;
      }
      if (result instanceof Promise) {
        return from(result);
      }
      return of(result);
    });

    return combineLatest(observables).pipe(
      map(results => {
        // If any result is a UrlTree, use the first one for navigation
        const urlTree = results.find(result => result instanceof UrlTree);
        if (urlTree) {
          return urlTree;
        }
        // All guards must return true to proceed
        return results.every(result => result === true);
      })
    );
  };
};