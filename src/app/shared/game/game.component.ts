import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Quarter, PlayerScore, Sample } from '../../shared/models/quarter.model';
import { GameService } from '../../services/game.service';

type Mashbill = 'Bourbon' | 'Rye' | 'Wheat' | 'Single Malt';

interface Guess {
  age: number;
  proof: number;
  mashbill: Mashbill | null;  // Allow null for initial state
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() quarterData: Quarter = {
    name: '',
    id: '',
    active: false,
    samples: {
      sample1: { age: 0, proof: 0, mashbill: 'Bourbon' },  // Set default values
      sample2: { age: 0, proof: 0, mashbill: 'Bourbon' },
      sample3: { age: 0, proof: 0, mashbill: 'Bourbon' },
      sample4: { age: 0, proof: 0, mashbill: 'Bourbon' }
    }
  };
  
  @Input() quarterId: string = '';
  currentSample: number = 1;
  playerName: string = '';
  guesses: { [key: string]: Guess } = {};
  scores: { [key: string]: number } = {};
  totalScore: number = 0;
  gameCompleted: boolean = false;
  scoreSubmitted: boolean = false;

  mashbillCategories: Mashbill[] = ['Bourbon', 'Rye', 'Wheat', 'Single Malt'];

  constructor(
    private firebaseService: FirebaseService,
    private gameService: GameService
  ) {}
  
  ngOnInit() {
    this.loadQuarterData();
  }

  loadQuarterData() {
    if (this.quarterId) {
      this.firebaseService.getQuarterById(this.quarterId).subscribe(quarter => {
        if (quarter) {
          this.quarterData = quarter;
          this.initializeGuesses();
        }
      });
    }
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
      return;
    }

    this.totalScore = 0;
    for (let i = 1; i <= 4; i++) {
      const sampleKey = `sample${i}`;
      const actualSample = this.quarterData.samples[sampleKey];
      const guess = this.guesses[sampleKey];
      
      if (!guess.mashbill) {
        continue;  // Skip if mashbill is null
      }
      
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
      return;
    }

    const playerScore: PlayerScore = {
      playerId: 'guest',
      playerName: this.playerName,
      score: this.totalScore,
      quarterId: this.quarterId
    };

    this.firebaseService.submitScore(playerScore).subscribe(
      () => {
        console.log('Score submitted successfully');
        this.scoreSubmitted = true;
      },
      error => console.error('Error submitting score:', error)
    );
  }

  playAgain() {
    this.currentSample = 1;
    this.totalScore = 0;
    this.gameCompleted = false;
    this.scoreSubmitted = false;
    this.initializeGuesses();
  }

  shareResults() {
    const shareText = `I scored ${this.totalScore} points in the Blind Barrels Whiskey Wiz game! Can you beat my score? #WhiskeyWiz`;
    navigator.clipboard.writeText(shareText)
      .then(() => console.log('Results copied to clipboard'))
      .catch(err => console.error('Failed to copy results:', err));
  }
}