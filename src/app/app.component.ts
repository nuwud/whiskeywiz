import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

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
  `]
})

export class AppComponent {
  title = 'Whiskey Wiz';
  isLoggedIn = false;
  deployTime =  new Date().toISOString();
  
  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.getAuthState().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
}