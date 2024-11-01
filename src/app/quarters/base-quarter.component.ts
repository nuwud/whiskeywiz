import { Component, Input, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { Quarter, PlayerScore } from '../shared/models/quarter.model';
import { SharedModule } from '../shared/shared.module';

@Component({
  template: `
    <div *ngIf="quarterData">
      <h2>{{ quarterData.name }}</h2>
      <!-- ... existing game logic ... -->
      <app-leaderboard [quarterId]="quarterId"></app-leaderboard>
    </div>
  `
})
export class BaseQuarterComponent implements OnInit {
  @Input()
  quarterId!: string;
  quarterData: Quarter | null = null;
  gameCompleted = false;
  playerScore: number = 0;
  guess = { age: 0, proof: 0, mashbill: '' };
  isGuest: boolean = true;
  playerId: string = 'guest';


  constructor(
    protected firebaseService: FirebaseService, 
    protected authService: AuthService
  ) {}

  ngOnInit() {
    this.initializePlayer();
  }

  protected initializePlayer(): void {
    this.authService.getCurrentUserId().pipe(
      catchError((error: Error) => {
        console.error('Error getting user ID:', error);
        return of(null);
      })
    ).subscribe(userId => {
      if (userId) {
        this.isGuest = false;
        this.playerId = userId;
        console.log('Authenticated user:', userId);
      } else {
        this.isGuest = true;
        this.playerId = 'guest_' + Math.random().toString(36).substr(2, 9);
        console.log('Guest player');
      }
      this.loadQuarterData();
    });
  }

  loadQuarterData() {
    this.firebaseService.getQuarterById(this.quarterId).subscribe(
      quarter => {
        this.quarterData = quarter;
      },
      error => {
        console.error('Error loading quarter data:', error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    );
  }

  submitGuess(guess: { age: number, proof: number, mashbill: string }) {
    if (!this.quarterData) return;

    let score = 0;
    const actualSample = this.quarterData.samples['sample1']; // Assuming we're using the first sample

    // Age scoring
    const ageDiff = Math.abs(actualSample.age - guess.age);
    if (ageDiff === 0) {
      score += 30; // 20 points + 10 bonus
    } else {
      score += Math.max(0, 20 - (ageDiff * 4));
    }

    // Proof scoring
    const proofDiff = Math.abs(actualSample.proof - guess.proof);
    if (proofDiff === 0) {
      score += 30; // 20 points + 10 bonus
    } else {
      score += Math.max(0, 20 - (proofDiff * 2));
    }

    // Mashbill scoring
    if (guess.mashbill === actualSample.mashbill) {
      score += 10;
    }

    this.playerScore = score;
    this.gameCompleted = true;
  }

  submitScore() {
    if (!this.quarterData) return;

    const playerScore: PlayerScore = {
      playerId: this.playerId,
      playerName: this.isGuest ? 'Guest Player' : 'Authenticated User',
      score: this.playerScore,
      quarterId: this.quarterId,
      isGuest: this.isGuest
    };

          this.firebaseService.submitScore(playerScore).subscribe(
            () => {
              console.log('Score submitted successfully');
            },
            error => {
              console.error('Error submitting score:', error);
            }
          );
  }

  resetGame() {
    this.gameCompleted = false;
    this.playerScore = 0;
    this.guess = { age: 0, proof: 0, mashbill: '' };
  }
}
