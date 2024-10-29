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
      userId = userId as string | null;
      if (userId) {
        // Handle authenticated user
        console.log('Authenticated user:', userId);
      } else {
        // Handle guest player
        console.log('Guest player');
      }
      userId = userId as string | null;
      if (userId) {
        // Handle authenticated user
        console.log('Authenticated user:', userId);
      } else {
        // Handle guest player
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
    if (this.quarterData) {
      this.authService.getCurrentUserId().subscribe(userId => {
        if (userId) {
          const playerScore: PlayerScore = {
            playerId: userId,
            playerName: 'Authenticated User',
            score: this.playerScore,
            quarterId: this.quarterId
          };
          this.firebaseService.submitScore(playerScore).subscribe(() => {
            console.log('Score submitted successfully');
          });
        }
      }, 
      error => { // Fallback to guest player
        const playerScore: PlayerScore = {
          playerId: 'guest', // You might want to implement user identification later
          playerName: 'Guest Player',
          score: this.playerScore,
          quarterId: this.quarterId
        };
        this.firebaseService.submitScore(playerScore).subscribe(() => {
          console.log('Score submitted successfully');
        },
        error => {
          console.error('Error submitting score:', error);
          // Handle the error appropriately (e.g., show an error message to the user)
        }
      );
      });
    }
  }

  resetGame() {
    this.gameCompleted = false;
    this.playerScore = 0;
    this.guess = { age: 0, proof: 0, mashbill: '' };
  }
}

function ofNull(arg0: null): any {
  throw new Error('Function not implemented.');
}
