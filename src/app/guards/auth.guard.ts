// auth.guards.ts
import { inject } from '@angular/core';
import { 
  CanActivateFn, 
  CanActivateChildFn,
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot,
  UrlTree 
} from '@angular/router';
import { 
  Observable, 
  map, 
  catchError, 
  of, 
  combineLatest, 
  from 
} from 'rxjs';
import { AuthService } from '../services/auth.service';

export type UserRole = 'admin' | 'superadmin' | 'player';

// Helper function to check user roles
const checkUserRole = (user: any, requiredRole: UserRole): boolean => {
  if (!user) return false;
  
  // Check for superadmin first (they have access to everything)
  if (user.email?.endsWith('@whiskeywiz.com')) return true;
  
  // For other roles, check the roles array
  return user.roles?.includes(requiredRole) || false;
};

export const canActivateAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(authenticated => {
      if (authenticated) {
        return true;
      }
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    })
  );
};

export const canActivateAdmin: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin().pipe(
    map(isAdmin => {
      if (isAdmin) {
        return true;
      }
      return router.createUrlTree(['/unauthorized']);
    }),
    catchError(() => {
      return of(router.createUrlTree(['/unauthorized']));
    })
  );
};

export const canActivateChild: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => canActivateAuth(route, state);

// If you need to combine multiple guards, you can create a helper function
export const combineGuards = (...guards: CanActivateFn[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const observables = guards.map(guard => {
      const result = guard(route, state);
      // Convert synchronous results to observables
      if (result instanceof Observable) {
        return result;
      }
      if (result instanceof Promise) {
        return from(result);
      }
      return of(result);
    });

    return combineLatest(observables).pipe(
      map(results => results.every(result => result === true))
    );
  };
};