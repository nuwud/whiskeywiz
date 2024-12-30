import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs/operators';

export const canActivateAuth: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAuthenticated().pipe(
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
      }
    })
  );
};

export const canActivateAdmin: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAdmin().pipe(
    tap(isAdmin => {
      if (!isAdmin) {
        router.navigate(['/']);
      }
    })
  );
};

export const canActivateGame: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAuthenticated().pipe(
    map(isAuthenticated => true) // Allow both authenticated and guest users
  );
};

export const combineGuards = (...guards: CanActivateFn[]): CanActivateFn => 
  (route, state) => {
    for (const guard of guards) {
      const result = guard(route, state);
      if (!result) return false;
    }
    return true;
  };