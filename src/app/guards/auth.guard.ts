import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs/operators';

export const canActivateAuth: CanActivateFn = (route, state) => {
  console.log('canActivateAuth called');
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAuthenticated().pipe(
    tap(isAuthenticated => {
      console.log('Auth check:', isAuthenticated);
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        router.navigate(['/login']);
      }
    })
  );
};

export const canActivateAdmin: CanActivateFn = (route, state) => {
  console.log('canActivateAdmin called');
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAdmin().pipe(
    tap(isAdmin => {
      console.log('Admin check:', isAdmin);
      if (!isAdmin) {
        console.log('Not admin, redirecting home');
        router.navigate(['/']);
      }
    })
  );
};

export const canActivateGame: CanActivateFn = (route, state) => {
  console.log('canActivateGame called');
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAuthenticated().pipe(
    map(isAuthenticated => true)
  );
};

export const combineGuards = (...guards: CanActivateFn[]): CanActivateFn => 
  (route, state) => {
    console.log('Combining guards');
    for (const guard of guards) {
      const result = guard(route, state);
      if (!result) return false;
    }
    return true;
  };

export const AuthGuard = {
  canActivate: canActivateAuth,
  canActivateAdmin,
  canActivateGame
};