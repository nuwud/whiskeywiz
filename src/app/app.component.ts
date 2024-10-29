import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <header>
      <h1>{{ title }}</h1>
      <nav *ngIf="isLoggedIn">
        <a routerLink="/logout">Logout</a>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <small class="version-indicator">Version: {{deployTime}}</small>
  `,
  styles: [`
    header {
      padding: 1rem;
      background: #f8f9fa;
    }
    nav {
      margin-top: 1rem;
    }
    a {
      cursor: pointer;
      color: #0066cc;
      text-decoration: underline;
    }
    a:hover {
      color: #004499;
    }
  `]
})

export class AppComponent {
  title = 'Whiskey Wiz';
  isLoggedIn = false;
  deployTime =  new Date().toISOString();
  
  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router
  ) {
    this.firebaseService.getAuthState().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  async logout(event: Event) {
    event.preventDefault();
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}