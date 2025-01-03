import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    console.log('AuthGuard initialized');
  }

  canActivate(): Observable<boolean> {
    console.log('AuthGuard canActivate called');
    return this.auth.isAdmin$.pipe(
      tap(isAdmin => {
        console.log('AuthGuard isAdmin check:', isAdmin);
        if (!isAdmin) {
          console.log('AuthGuard: Not admin, redirecting to home');
          this.router.navigate(['/']);
        }
      })
    );
  }
}