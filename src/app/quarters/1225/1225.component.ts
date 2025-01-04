import { Component, Input } from '@angular/core';
import { BaseQuarterComponent } from '../base-quarter.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { NgForm } from '@angular/forms';
import { FirebaseApp } from '@angular/fire/app';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-quarter-1225',
  template: `
    <app-game-banner 
      [quarterId]="quarterId"
      [quarterName]="quarterName || 'December 2025'">
    </app-game-banner>
  `,
  styles: [`
    small { color: red; }
  `]
})
export class Q1225Component extends BaseQuarterComponent {
  @Input() override quarterId: string = '1225';
  @Input() quarterName: string = 'December 2025';

  constructor(
    app: FirebaseApp,
    firebaseService: FirebaseService,
    authService: AuthService,
    analyticsService: AnalyticsService
  ) {
    super(app, firebaseService, authService, analyticsService);
  }

  onSubmit(form: NgForm) {
    if (!this.app) {
      console.error('Firebase not initialized');
      return;
    }
    
    if (form.valid) {
      const guess = {
        age: form.value.ageGuess,
        proof: form.value.proofGuess,
        mashbill: form.value.mashbillGuess
      };
      this.submitGuess(guess);
    }
  }
}
