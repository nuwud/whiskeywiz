import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Correcting auth import
import firebase from 'firebase/compat/app'; // Import firebase for GoogleAuthProvider
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Fixed typo from 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  title = 'whiskeywiz1';

  // Injecting Firebase Authentication and Firestore
  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) {}

  // Method for login using Firebase Authentication and Google Provider
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(result => {
      console.log('User logged in:', result.user);
    }).catch(error => {
      console.error('Login error:', error);
    });
  }

  // Method for logout
  logout() {
    this.auth.signOut().then(() => {
      console.log('User logged out');
    }).catch(error => {
      console.error('Logout error:', error);
    });
  }

  // Example method to add test data to Firestore
  addTestData() {
    this.firestore.collection('test-collection').add({
      name: 'Test Document',
      createdAt: new Date()
    }).then(() => console.log('Document added!'))
    .catch(error => console.error('Error adding document:', error));
  }
}
