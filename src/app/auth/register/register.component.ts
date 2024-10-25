// src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <div *ngIf="error" class="error">{{ error }}</div>
      <form (ngSubmit)="register()">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" [(ngModel)]="email" name="email" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
    }
    .error {
      color: red;
      margin-bottom: 10px;
    }
  `]
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async register() {
    try {
      await this.authService.register(this.email, this.password);
      this.router.navigate(['/admin']); // or wherever you want to redirect
    } catch (error) {
      this.error = 'Registration failed. Please try again.';
      console.error('Registration error:', error);
    }
  }
}