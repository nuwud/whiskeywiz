// login.component.ts
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
      const result = await this.authService.signIn(this.email, this.password);
      console.log('Login successful, navigating...');
      
      // Route based on admin status
      if (this.authService.isAdminSync(this.email)) {
        await this.router.navigate(['/admin']);
      } else {
        await this.router.navigate(['/player']);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.error = error.message || 'Failed to log in. Please check your credentials.';
    }
  }
}