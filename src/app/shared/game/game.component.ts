import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { Observable } from 'rxjs';
import { SampleGuess } from '../models/game.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  currentSample = 'A';
  isLoggedIn$: Observable<boolean>;
  guesses: { [key: string]: SampleGuess } = {};
  totalScore = 0;
  showResults = false;
  @Output() gameComplete = new EventEmitter<number>();

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isAuthenticated();
    this.initializeGame();
  }

  private async initializeGame() {
    try {
      await this.loadSampleData();
      this.setupGameState();
    } catch (error) {
      console.error('Error initializing game:', error);
      this.handleError('Unable to initialize game');
    }
  }

  private async loadSampleData() {
    try {
      const gameData = await this.gameService.loadGameData();
      // Process game data
    } catch (error) {
      console.error('Error loading game data:', error);
      throw error;
    }
  }

  private setupGameState() {
    this.guesses = {
      A: { age: 0, proof: 0, mashbill: '' },
      B: { age: 0, proof: 0, mashbill: '' },
      C: { age: 0, proof: 0, mashbill: '' },
      D: { age: 0, proof: 0, mashbill: '' }
    };
  }

  async submitGuesses() {
    try {
      const score = await this.gameService.calculateScore(this.guesses);
      this.totalScore = score.totalScore;
      this.showResults = true;
      this.gameComplete.emit(this.totalScore);

      await this.saveScore();
    } catch (error) {
      console.error('Error submitting guesses:', error);
      this.handleError('Unable to submit guesses');
    }
  }

  private async saveScore() {
    try {
      await this.firebaseService.saveScore({
        score: this.totalScore,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error saving score:', error);
      // Don't show error to user, score save is non-critical
    }
  }

  async share() {
    const text = `I scored ${this.totalScore} points in WhiskeyWiz!\nPlay now: https://whiskeywiz2.web.app`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'WhiskeyWiz Score',
          text,
          url: 'https://whiskeywiz2.web.app'
        });
      } else {
        await navigator.clipboard.writeText(text);
        // Show toast or notification that text was copied
      }
    } catch (error) {
      console.error('Error sharing:', error);
      this.handleError('Unable to share results');
    }
  }

  private handleError(message: string) {
    // Show error message to user
    console.error(message);
  }
}
