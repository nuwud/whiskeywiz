import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  template: `
    <header>
      <h1>{{ title }}</h1>
      <nav *ngIf="isLoggedIn">
        <a href="/logout">Logout</a>
      </nav>
    </header>
    <main>
      <div id="content"></div>
    </main>
  `
})
export class AppComponent {
  title = 'Whiskey Wiz';
  isLoggedIn = false; // Set this based on your auth service

  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.getAuthState().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
}