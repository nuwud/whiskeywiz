import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Quarter, PlayerScore } from '../shared/models/quarter.model';
@Component({
  template: ''
})
export class BaseQuarterComponent implements OnInit {
  @Input()
    quarterId!: string;
    quarterData: Quarter | null = null;
    gameCompleted = false;
    playerScore: number = 0;
    guess = { age: 0, proof: 0, mashbill: '' };

  constructor(protected firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadQuarterData();
  }

  loadQuarterData() {
    this.firebaseService.getQuarterById(this.quarterId).subscribe(quarter => {
      this.quarterData = quarter;
    });
  }

  submitGuess(guess: { age: number, proof: number, mashbill: string }) {
    // Implement guess logic and scoring
    // This is where you'd compare the guess to the actual values and calculate the score
    // For now, let's just set a random score
    this.playerScore = Math.floor(Math.random() * 100);
    this.gameCompleted = true;
  }

  submitScore() {
    if (this.quarterData) {
      const playerScore: PlayerScore = {
        playerId: 'guest', // You might want to implement user identification later
        playerName: 'Guest Player',
        score: this.playerScore,
        quarterId: this.quarterId
      };
      this.firebaseService.submitScore(playerScore).subscribe(() => {
        console.log('Score submitted successfully');
      });
    }
  }
}