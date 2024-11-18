import { Component, Input, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { Quarter, PlayerScore } from '../shared/models/quarter.model';

@Component({
  template: `
    <app-game-banner 
      [quarterId]="quarterId"
      [quarterName]="quarterData?.name || getDefaultQuarterName()">
    </app-game-banner>
    
    <div class="leaderboard-container" *ngIf="showLeaderboard">
      <app-leaderboard [quarterId]="quarterId"></app-leaderboard>
    </div>
  `
})
export class BaseQuarterComponent implements OnInit {
  @Input() quarterId!: string;
  quarterData: Quarter | null = null;
  showLeaderboard: boolean = false;
  guess: { age: number; proof: number; mashbill: string } = { age: 0, proof: 0, mashbill: '' };
  isGuest: boolean = true;
  playerId: string = 'guest';
  gameCompleted = false;
  playerScore: number = 0;

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

  protected getDefaultQuarterName(): string {
    if (!this.quarterId) return 'Whiskey Wiz Challenge';
    
    const month = parseInt(this.quarterId.substring(0, 2));
    const year = '20' + this.quarterId.substring(2, 4);
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${monthNames[month - 1]} ${year}`;
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

    this.gameCompleted = true;
    this.submitScore();
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
