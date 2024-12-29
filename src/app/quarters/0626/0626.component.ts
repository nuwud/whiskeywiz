import { Component, Inject, ChangeDetectorRef, Input } from '@angular/core';
import { BaseQuarterComponent } from '../base-quarter.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { NgForm } from '@angular/forms';
import { FirebaseApp } from '@angular/fire/app';
import { FIREBASE_APP } from '../../app.module';
import { AnalyticsService } from 'src/app/services/analytics.service';


@Component({
  selector: 'app-quarter-0626',
  template: `
    <app-game-banner 
      [quarterId]="quarterId"
      [quarterName]="quarterName || 'June 2026'">
    </app-game-banner>
  `,
  styles: [`
    small { color: red; }
  `]
})
export class Q0626Component extends BaseQuarterComponent {
  @Input() override quarterId: string = '0626';
  @Input() quarterName: string = 'June 2026';

  constructor(
    @Inject(FIREBASE_APP) app: FirebaseApp,
    firebaseService: FirebaseService,
    authService: AuthService,
    analyticsService: AnalyticsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(app, firebaseService, authService, analyticsService);
    this.quarterId = '0626';
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
      super.submitGuess(guess);
      this.changeDetectorRef.detectChanges();
    }
  }
}