import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  login() {
    this.firebaseService.signIn(this.email, this.password).subscribe(
      () => {
        this.router.navigate(['/admin']);
      },
      (error) => {
        this.error = 'Failed to log in. Please check your credentials.';
        console.error('Login error:', error);
      }
    );
  }

  logout() {
    this.firebaseService.signOut().subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.error = 'Failed to log out.';
        console.error('Logout error:', error);
      }
    );
  }
}