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
    <small class="version-indicator" style="position: fixed; bottom: 5px; right: 5px; background: #f8f9fa; padding: 5px; border-radius: 4px; font-size: 10px;">
      Version: {{pacificTime}}
    </small>
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
    .version-indicator {
      opacity: 0.7;
    }
    .version-indicator:hover {
      opacity: 1;
    }
  `]
})
export class AppComponent {
  title = 'Whiskey Wiz';
  isLoggedIn = false;
  pacificTime: string;
  
  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router
  ) {
    this.firebaseService.getAuthState().subscribe(user => {
      this.isLoggedIn = !!user;
    });
    
    // Set Pacific Time version
    const now = new Date();
    this.pacificTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);
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