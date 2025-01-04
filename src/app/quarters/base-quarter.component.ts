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
      [quarterName]="quarterName">
    </app-game-banner>
  `
})
export class BaseQuarterComponent {
  @Input() quarterId: string = '';
  @Input() quarterName: string = '';
  protected firebase: FirebaseService;
  protected auth: AuthService;
  protected analytics: AnalyticsService;

  constructor(
    protected firebaseService: FirebaseService,
    protected authService: AuthService,
    analyticsService: AnalyticsService
  ) {
    this.firebase = firebaseService;
    this.auth = authService;
    this.analytics = analyticsService;
  }

  protected async submitGuess(guess: { age: number; proof: number; mashbill: string }) {
    if (!this.quarterId) {
      console.error('No quarter ID available');
      return;
    }

    try {
      await this.analytics.logEvent('guess_submitted', {
        quarterId: this.quarterId,
        ...guess
      });

      // Additional guess submission logic will go here
      console.log('Submitting guess:', guess);
    } catch (error) {
      console.error('Error submitting guess:', error);
    }
  }
}
