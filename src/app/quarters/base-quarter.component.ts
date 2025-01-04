import { Component, Input } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-base-quarter',
  template: `
    <app-game-banner
      [quarterId]="quarterId"
      [quarterName]="'Q' + quarterId.substring(0, 1) + ' 20' + quarterId.substring(1)">
    </app-game-banner>
  `
})
export class BaseQuarterComponent {
  @Input() quarterId: string = '';
  protected app: FirebaseApp;
  protected analytics: AnalyticsService;

  constructor(
    app: FirebaseApp,
    protected firebaseService: FirebaseService,
    protected authService: AuthService,
    analyticsService: AnalyticsService
  ) {
    this.app = app;
    this.analytics = analyticsService;
  }

  protected submitGuess(guess: { age: number; proof: number; mashbill: string }) {
    // Implement base guess submission logic
    console.log('Submitting guess:', guess);
  }
}
