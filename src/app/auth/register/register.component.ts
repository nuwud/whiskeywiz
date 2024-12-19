import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <h2 class="font-hermona-2xl">Create Account</h2>
      <div *ngIf="error" class="error">{{ error }}</div>
      <form (ngSubmit)="register()" class="register-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" [(ngModel)]="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" required>
        </div>
        <div class="button-group">
          <button type="submit" class="register-button">Register</button>
          <button type="button" class="back-button" (click)="backToLogin()">Back to Login</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 30px;
      background-color: rgba(0, 0, 0, 0.8);
      border: 2px solid var(--color-gold);
      border-radius: 8px;
      color: var(--color-gold);
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    input {
      padding: 10px;
      border: 1px solid var(--color-gold);
      background: rgba(0, 0, 0, 0.6);
      color: white;
      border-radius: 4px;
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    button {
      padding: 10px 20px;
      border: 2px solid var(--color-gold);
      background: none;
      color: var(--color-gold);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: var(--color-gold);
        color: black;
      }
    }

    .error {
      color: #ff6b6b;
      background: rgba(255, 107, 107, 0.1);
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
  `]
})
export class RegisterComponent implements OnInit {
  email: string = '';
  password: string = '';
  error: string = '';
  returnQuarter: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Preserve return quarter parameter
    this.route.queryParams.subscribe(params => {
      this.returnQuarter = params['quarter'];
    });
  }

  async register() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    try {
      // Check for existing guest id to transfer scores
      const guestId = localStorage.getItem('guestId');
      
      // Register user
      await this.authService.register(this.email, this.password);
      
      // If there was a guest ID, transfer scores
      if (guestId) {
        await this.authService.transferGuestScores(guestId, this.email);
        localStorage.removeItem('guestId');
      }

      // Navigate based on return quarter
      if (this.returnQuarter) {
        this.router.navigate(['/game'], {
          queryParams: { quarter: this.returnQuarter }
        });
      } else {
        this.router.navigate(['/game'], {
          queryParams: { quarter: '0122' }
        });
      }
    } catch (error: any) {
      this.error = this.getErrorMessage(error);
      console.error('Registration error:', error);
    }
  }

  backToLogin() {
    this.router.navigate(['/login'], {
      queryParams: this.returnQuarter ? { quarter: this.returnQuarter } : {}
    });
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'auth/email-already-in-use') {
      return 'This email is already registered. Please login instead.';
    }
    if (error.code === 'auth/weak-password') {
      return 'Please use a stronger password (at least 6 characters)';
    }
    if (error.code === 'auth/invalid-email') {
      return 'Please enter a valid email address';
    }
    return 'Registration failed. Please try again.';
  }
}