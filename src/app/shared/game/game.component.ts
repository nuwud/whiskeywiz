import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService, Quarter } from '../../services/firebase.service';

interface Guess {
  age: number;
  proof: number;
  mashbill: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() quarterId: string = '';
  quarterData: Quarter | null = null;
  currentSample: number = 1;
  guesses: { [key: string]: Guess } = {};
  scores: { [key: string]: number } = {};
  totalScore: number = 0;
  gameCompleted: boolean = false;
  playerName: string = '';

  mashbillCategories = ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Blend', 'Specialty'];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadQuarterData();
  }

  loadQuarterData() {
    this.firebaseService.getQuarterById(this.quarterId).subscribe(quarter => {
      this.quarterData = quarter;
      this.initializeGuesses();
    });
  }

  initializeGuesses() {
    if (this.quarterData) {
      for (let i = 1; i <= 4; i++) {
        this.guesses[`sample${i}`] = { age: 5, proof: 100, mashbill: '' };
        this.scores[`sample${i}`] = 0;
      }
    }
  }

  submitGuess() {
    if (this.quarterData) {
      const sampleKey = `sample${this.currentSample}`;
      const actualSample = this.quarterData.samples[sampleKey];
      const guess = this.guesses[sampleKey];
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

      if (this.currentSample < 4) {
        this.currentSample++;
      } else {
        this.gameCompleted = true;
      }
    }
  }

  
  finishGame() {
    this.gameCompleted = true;
    if (this.playerName) {
      const playerScore: PlayerScore = {
        playerId: 'guest', // You might want to implement user authentication to get a real user ID
        playerName: this.playerName,
        score: this.totalScore,
        quarterId: this.quarterId
      };
      this.firebaseService.submitScore(playerScore).subscribe(
        () => console.log('Score submitted successfully'),
        error => console.error('Error submitting score:', error)
      );
    }
  }

  restartGame() {
    this.currentSample = 1;
    this.totalScore = 0;
    this.gameCompleted = false;
    this.initializeGuesses();
  }

  shareResults() {
    // Implement sharing functionality
    const shareText = `I scored ${this.totalScore} points in the Whiskey Wiz game! Can you beat my score? #WhiskeyWiz`;
    // You can implement social media sharing here, or copy to clipboard
    console.log('Sharing:', shareText);
  }
}