import { Component, Input } from '@angular/core';
import { BaseQuarterComponent } from '../base-quarter.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { NgForm } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-quarter-0324',
  template: `
    <app-game-banner 
      [quarterId]="quarterId"
      [quarterName]="quarterName || 'March 2024'">
    </app-game-banner>
  `,
  styles: [`
    small { color: red; }
  `]
})
export class Q0324Component extends BaseQuarterComponent {
  @Input() override quarterId: string = '0324';
  @Input() override quarterName: string = 'March 2024';

  constructor(
    firebaseService: FirebaseService,
    authService: AuthService,
    analyticsService: AnalyticsService
  ) {
    super(firebaseService, authService, analyticsService);
  }

  onSubmit(form: NgForm) {
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
