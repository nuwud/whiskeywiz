import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-error',
  template: `
    <div class="error-container">
      <h1>{{ message }}</h1>
      <p>{{ details }}</p>
      
      <div class="actions">
        <button (click)="goBack()" class="back-btn">
          Go Back
        </button>
        <button (click)="retry()" class="retry-btn">
          Try Again
        </button>
        <button *ngIf="canGoHome" (click)="goHome()" class="home-btn">
          Go Home
        </button>
      </div>

      <div *ngIf="autoRedirect" class="redirect-message">
        Redirecting in {{ redirectCountdown }} seconds...
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      border: 2px solid #FFD700;
      border-radius: 8px;
      color: #FFD700;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: 2px solid #FFD700;
      border-radius: 4px;
      background: transparent;
      color: #FFD700;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #FFD700;
        color: black;
      }
    }

    .redirect-message {
      margin-top: 1rem;
      font-size: 0.875rem;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .error-container {
        margin: 1rem;
        padding: 1rem;
      }

      .actions {
        flex-direction: column;
        gap: 0.5rem;
      }

      button {
        width: 100%;
      }
    }
  `]
})
export class ErrorComponent implements OnInit {
  message = 'An error occurred';
  details = '';
  canGoHome = true;
  autoRedirect = false;
  redirectCountdown = 5;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    // Get error message from route data or query params
    const routeMessage = this.route.snapshot.data['message'];
    const queryMessage = this.route.snapshot.queryParams['message'];
    this.message = queryMessage || routeMessage || this.message;
    this.details = this.route.snapshot.queryParams['details'] || '';

    // Check if we should auto-redirect
    this.autoRedirect = this.route.snapshot.queryParams['redirect'] === 'true';
    if (this.autoRedirect) {
      this.startRedirectCountdown();
    }
  }

  private startRedirectCountdown() {
    timer(0, 1000).pipe(
      take(6)
    ).subscribe({
      next: (count) => {
        this.redirectCountdown = 5 - count;
        if (count === 5) {
          this.goHome();
        }
      }
    });
  }

  goBack() {
    this.location.back();
  }

  retry() {
    window.location.reload();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}