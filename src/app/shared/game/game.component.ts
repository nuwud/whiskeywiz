import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Quarter, PlayerScore } from '../../shared/models/quarter.model';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';

type Mashbill = 'Bourbon' | 'Rye' | 'Wheat' | 'Single Malt' | 'Specialty';

interface Guess {
  age: number;
  proof: number;
  mashbill: Mashbill | null;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
isLoggedIn: any;
logout() {
  this.authService.signOut().then(() => {
    // Handle any post-logout navigation or UI updates
  }).catch(error => {
    console.error('Error logging out:', error);
  });
}
  @Input() set quarterId(value: string) {
    if (value) {
      this._quarterId = value;
      this.loadQuarterData();
    }
  }
  get quarterId(): string {
    return this._quarterId;
  }

  private _quarterId: string = '';
  playerId: string = '';
  isGuest: boolean = true;
  quarterData: Quarter | null = null;
  currentSample: number = 1;
  playerName: string = '';
  guesses: { [key: string]: Guess } = {};
  scores: { [key: string]: number } = {};
  totalScore: number = 0;
  gameCompleted: boolean = false;
  scoreSubmitted: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  mashbillCategories: Mashbill[] = ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Specialty'];
  mashbillTypes = ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Specialty'];

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private gameService: GameService,
    private authService: AuthService
  ) {
    this.authService.getPlayerId().subscribe(id => {
      this.playerId = id;
      this.isGuest = id.startsWith('guest_');
    });
  }

  ngOnInit() {
    // Handle route parameters for direct navigation
    this.route.queryParams.subscribe(params => {
      const quarterId = params['quarter'];
      if (quarterId) {
        this.quarterId = quarterId;
      }
    });
  }

  getSampleLetter(num: number): string {
    return String.fromCharCode(64 + num); // Converts 1 to A, 2 to B, etc.
  }

  loadQuarterData() {
    if (!this._quarterId) return;

    this.loading = true;
    this.error = null;

    this.firebaseService.getQuarterById(this._quarterId).subscribe(
      quarter => {
        if (quarter) {
          this.quarterData = quarter;
          this.initializeGuesses();
        } else {
          this.error = 'Quarter not found';
        }
        this.loading = false;
      },
      error => {
        console.error('Error loading quarter:', error);
        this.error = 'Failed to load quarter data';
        this.loading = false;
      }
    );
  }

  changeSample(direction: number) {
    const newSample = this.currentSample + direction;
    if (newSample >= 1 && newSample <= 4) {
      this.currentSample = newSample;
    }
  }
  
private isValidQuarter(quarter: any): quarter is Quarter {
  return quarter 
    && typeof quarter === 'object'
    && 'id' in quarter
    && 'name' in quarter
    && 'samples' in quarter;
}

  initializeGuesses() {
    for (let i = 1; i <= 4; i++) {
      this.guesses[`sample${i}`] = {
        age: 5,
        proof: 100,
        mashbill: null
      };
      this.scores[`sample${i}`] = 0;
    }
  }

  updateGuess(sampleNum: number, field: keyof Guess, value: any) {
    if (!this.guesses[`sample${sampleNum}`]) {
      this.guesses[`sample${sampleNum}`] = { age: 5, proof: 100, mashbill: null };
    }
    (this.guesses[`sample${sampleNum}`][field] as any) = value;
  }

  areAllGuessesFilled(): boolean {
    for (let i = 1; i <= 4; i++) {
      const guess = this.guesses[`sample${i}`];
      if (!guess || !guess.mashbill || guess.age <= 0 || guess.proof <= 0) {
        return false;
      }
    }
    return true;
  }

  submitGuesses() {
    if (!this.areAllGuessesFilled()) {
      this.error = 'Please fill in all guesses';
      return;
    }

    this.totalScore = 0;
    for (let i = 1; i <= 4; i++) {
      const sampleKey = `sample${i}`;
      const actualSample = this.quarterData?.samples[sampleKey];
      const guess = this.guesses[sampleKey];

      if (!actualSample || !guess.mashbill) continue;

      let score = 0;

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

      this.scores[sampleKey] = score;
      this.totalScore += score;
    }

    this.gameCompleted = true;
    
  }

  submitScore() {
    if (!this.playerName) {
      this.error = 'Please enter your name';
      return;
    }

    if (!this._quarterId) {
      this.error = 'Quarter ID is missing';
      return;
    }

    const playerScore: PlayerScore = {
      playerId: this.playerId,
      playerName: this.isGuest ? this.playerName : '',  // For registered users, name comes from profile
      score: this.totalScore,
      quarterId: this._quarterId,
      isGuest: this.isGuest
    };

    this.firebaseService.submitScore(playerScore).subscribe(
      () => {
        console.log('Score submitted successfully');
        this.scoreSubmitted = true;
        this.error = null;

        if (this.isGuest) {
          // Prompt to register to save scores
          this.showRegisterPrompt();
        }
      },
      error => {
        console.error('Error submitting score:', error);
        this.error = 'Failed to submit score';
      }
    );
  }

  private showRegisterPrompt() {
    // Implementation for showing registration prompt
    // Could be a modal or a simple message
  }

  playAgain() {
    this.currentSample = 1;
    this.totalScore = 0;
    this.gameCompleted = false;
    this.scoreSubmitted = false;
    this.error = null;
    this.initializeGuesses();
  }

  async share() {
    const shareData = {
      title: 'Whiskey Wiz Challenge',
      text: this.getShareText(),
      url: `https://whiskeywiz2.web.app/game?quarter=${this._quarterId}`
    };
  
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        this.fallbackShare();
      }
    } else {
      this.fallbackShare();
    }
  }
  
  private getShareText(): string {
    const quip = this.getScoreQuip();
    return `🥃 I scored ${this.totalScore} points in Whiskey Wiz!\n${quip}\nCan you beat my score? #WhiskeyWiz`;
  }
  
  private getScoreQuip(): string {
    if (this.totalScore >= 240) return "🌟 Master Distiller Status!";
    if (this.totalScore >= 200) return "🥃 Whiskey Connoisseur!";
    if (this.totalScore >= 160) return "👍 Solid Palate!";
    if (this.totalScore >= 120) return "🎯 Good Start!";
    return "🌱 Keep Tasting!";
  }
  
  private fallbackShare() {
    const text = this.getShareText();
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Results copied to clipboard! Share with your friends!');
      })
      .catch(err => {
        console.error('Failed to copy results:', err);
        alert('Unable to copy results. Please try again.');
      });
  }
}