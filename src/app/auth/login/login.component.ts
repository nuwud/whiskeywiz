import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
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
  isLoggedIn: boolean = false;

  constructor(
    public authService: AuthService, 
    private router: Router
  ) {}

  async login() {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    try {
      console.log('Attempting login...');
      await this.authService.signIn(this.email, this.password);
      console.log('Login successful');
      this.isLoggedIn = true;
      await this.router.navigate(['/player']); // Change this to /player instead of /admin first
    } catch (error: any) {
      console.error('Login error:', error);
      this.error = error.message || 'Failed to log in. Please check your credentials.';
      this.isLoggedIn = false;
    }
  }

  navigateTo(destination: string): void {
    // Implement navigation logic here
    console.log(`Navigating to ${destination}`);
  }

}