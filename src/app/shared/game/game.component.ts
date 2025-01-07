import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { SampleGuess, GameState } from '../models/game.model';
import { SampleLetter } from '../models/quarter.model';
import { OfflineQueueService } from '../../services/offline-queue.service';
import { ValidationService } from '../../services/validation.service';
import { Observable, from, of } from 'rxjs';
import { Router } from '@angular/router';
import { DataCollectionService } from '../../services/data-collection.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  readonly sampleLetters: SampleLetter[] = ['A', 'B', 'C', 'D'];
  currentSample: SampleLetter = 'A';
  isLoggedIn$: Observable<boolean> = of(false);
  guesses: Record<SampleLetter, SampleGuess> = {
    'A': { age: 0, proof: 0, mashbill: '' },
    'B': { age: 0, proof: 0, mashbill: '' },
    'C': { age: 0, proof: 0, mashbill: '' },
    'D': { age: 0, proof: 0, mashbill: '' }
  };
  totalScore = 0;
  showResults = false;
  @Output() gameComplete = new EventEmitter<number>();

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private gameService: GameService,
    private router: Router,
    private offlineQueue: OfflineQueueService,
    private validation: ValidationService,
    private dataCollection: DataCollectionService
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isAuthenticated();
    this.initializeGame();
  }

  setSample(letter: SampleLetter): void {
    this.currentSample = letter;
  }

  private async initializeGame() {
    try {
      const gameData = await this.loadSampleData();
      if (gameData && !this.validation.isValidGameData(gameData)) {
        throw new Error('Invalid game data');
      }
      this.setupGameState();
      await this.offlineQueue.processQueue();
    } catch (error) {
      console.error('Error initializing game:', error);
      this.handleError('Unable to initialize game');
      this.router.navigate(['/error']);
    }
  }

  private async loadSampleData(): Promise<GameState | null> {
    try {
      const gameData = await this.gameService.loadGameData();
      if (!gameData) {
        this.dataCollection.logError('No game data available');
        return null;
      }
      return gameData;
    } catch (error) {
      console.error('Error loading game data:', error);
      throw error;
    }
  }

  private setupGameState() {
    this.guesses = {
      'A': { age: 0, proof: 0, mashbill: '' },
      'B': { age: 0, proof: 0, mashbill: '' },
      'C': { age: 0, proof: 0, mashbill: '' },
      'D': { age: 0, proof: 0, mashbill: '' }
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
      this.dataCollection.logError('Non-critical: Error saving score');
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
      }
    } catch (error) {
      console.error('Error sharing:', error);
      this.handleError('Unable to share results');
    }
  }

  private handleError(message: string) {
    this.dataCollection.logError(message);
  }
}