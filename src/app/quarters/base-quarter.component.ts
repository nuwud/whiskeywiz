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
<<<<<<< HEAD
  @Input() quarterId: string;
  @Input() quarterName: string;
||||||| b66c326
  @Input() quarterId: string;
=======
  @Input() quarterId: string = '';
  protected app: FirebaseApp;
  protected analytics: AnalyticsService;
>>>>>>> 910f2ed56ac2a777b23c86bd7450b0f9d5c487d0

<<<<<<< HEAD
  constructor() {
    this.quarterId = '';
    this.quarterName = '';
||||||| b66c326
  constructor() {
    this.quarterId = '';
=======
  constructor(
    app: FirebaseApp,
    protected firebaseService: FirebaseService,
    protected authService: AuthService,
    analyticsService: AnalyticsService
  ) {
    this.app = app;
    this.analytics = analyticsService;
>>>>>>> 910f2ed56ac2a777b23c86bd7450b0f9d5c487d0
  }

  protected submitGuess(guess: { age: number; proof: number; mashbill: string }) {
    // Implement base guess submission logic
    console.log('Submitting guess:', guess);
  }
}
