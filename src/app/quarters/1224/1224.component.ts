// 1224.component.ts
/** 
 * Whiskey Wiz Quarter Component - Q4 2024 
 * 
 * Integration:
 * <whiskey-wiz-1224></whiskey-wiz-1224> 
 */
import { Component, Input } from '@angular/core';
import { BaseQuarterComponent } from '../base-quarter.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-quarter-1224',
  template: `
    <app-game-banner 
      [quarterId]="quarterId"
      [quarterName]="quarterName || 'December 2024'">
    </app-game-banner>
    <div *ngIf="!quarterData">Loading...</div>
    <div *ngIf="quarterData">
      <h2>{{ quarterData?.name || 'December 2024' }}</h2>
      <div *ngIf="!gameCompleted">
        <form (ngSubmit)="onSubmit(guessForm)" #guessForm="ngForm">
          <div>
            <label for="ageGuess">Age Guess:</label>
            <input type="number" id="ageGuess" name="ageGuess" [(ngModel)]="guess.age" required min="0" #ageGuess="ngModel">
            <div *ngIf="ageGuess.invalid && (ageGuess.dirty || ageGuess.touched)">
              <small *ngIf="ageGuess.errors?.['required']">Age guess is required.</small>
              <small *ngIf="ageGuess.errors?.['min']">Age must be 0 or greater.</small>
            </div>
          </div>
          <div>
            <label for="proofGuess">Proof Guess:</label>
            <input type="number" id="proofGuess" name="proofGuess" [(ngModel)]="guess.proof" required min="0" max="200" #proofGuess="ngModel">
            <div *ngIf="proofGuess.invalid && (proofGuess.dirty || proofGuess.touched)">
              <small *ngIf="proofGuess.errors?.['required']">Proof guess is required.</small>
              <small *ngIf="proofGuess.errors?.['min']">Proof must be 0 or greater.</small>
              <small *ngIf="proofGuess.errors?.['max']">Proof must be 200 or less.</small>
            </div>
          </div>
          <div>
            <label for="mashbillGuess">Mashbill Guess:</label>
            <select id="mashbillGuess" name="mashbillGuess" [(ngModel)]="guess.mashbill" required #mashbillGuess="ngModel">
              <option value="Bourbon">Bourbon</option>
              <option value="Rye">Rye</option>
              <option value="Wheat">Wheat</option>
              <option value="Single Malt">Single Malt</option>
            </select>
            <div *ngIf="mashbillGuess.invalid && (mashbillGuess.dirty || mashbillGuess.touched)">
              <small *ngIf="mashbillGuess.errors?.['required']">Mashbill guess is required.</small>
            </div>
          </div>
          <button type="submit" [disabled]="!guessForm.form.valid">Submit Guess</button>
        </form>
      </div>
      <div *ngIf="gameCompleted">
        <h3>Game Completed!</h3>
        <p>Your score: {{ playerScore }}</p>
        <button (click)="submitScore()">Submit Score</button>
      </div>
    </div>
  `,
  styles: [`
    /* Add any specific styles here */
    small {
      color: red;
    }
  `]
})
export class Q1224Component extends BaseQuarterComponent {
  @Input() quarterId: string = '1224';
  @Input() quarterName: string = 'December 2024';

  constructor(
    firebaseService: FirebaseService,
    authService: AuthService
  ) {
    super(firebaseService, authService);
    this.quarterId = '1224';
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const guess: { age: number; proof: number; mashbill: string } = {
        age: form.value.ageGuess,
        proof: form.value.proofGuess,
        mashbill: form.value.mashbillGuess
      };
      super.submitGuess(guess);
    }
  }
}

