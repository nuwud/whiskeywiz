import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <nav *ngIf="authService.isAuthenticated() | async">
      <button (click)="authService.signOut()">Sign Out</button>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #1A1A1A;
    }
    nav {
      padding: 1rem;
      text-align: right;
    }
    button {
      padding: 0.5rem 1rem;
      background: #FFD700;
      border: none;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover {
      opacity: 0.9;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
