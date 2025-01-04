import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, forkJoin as rxForkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const canActivateAuth: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};

export const canActivateAdmin: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAdmin().pipe(
    map(isAdmin => {
      if (!isAdmin) {
        router.navigate(['/unauthorized']);
        return false;
      }
      return true;
    })
  );
};

export const canActivateGame: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};

export const combineGuards = (...guards: CanActivateFn[]): CanActivateFn =>
  (route, state) => {
    return forkJoin(guards.map(guard => guard(route, state) as Observable<boolean>)).pipe(
      map(results => results.every(result => result === true))
    );
  };

type GuardResult = boolean | UrlTree;
type MaybeAsync<T> = T | Promise<T> | Observable<T>;

function forkJoin(arg0: MaybeAsync<boolean>[]) {
  return rxForkJoin(arg0);
}
