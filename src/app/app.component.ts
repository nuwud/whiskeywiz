import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Whiskey Wiz';
  isLoggedIn = false;

  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.getAuthState().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
}