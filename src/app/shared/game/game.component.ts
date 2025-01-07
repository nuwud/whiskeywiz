import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { SampleGuess, GameState, ScoreResult } from '../models/game.model';
import { OfflineQueueService } from '../../services/offline-queue.service';
import { ValidationService } from '../../services/validation.service';
import { Observable, from, of, Subscription, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataCollectionService } from '../../services/data-collection.service';
import { debounceTime, takeUntil } from 'rxjs/operators';

type SampleLetter = 'A' | 'B' | 'C' | 'D';

interface SampleStatus {
  completed: boolean;
  validated: boolean;
  hasErrors: boolean;
  errorMessage?: string;
}

interface LoadingStates {
  initializing: boolean;
  savingGuesses: boolean;
  submitting: boolean;
  sharingResults: boolean;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  readonly sampleLetters: SampleLetter[] = ['A', 'B', 'C', 'D'];
  currentSample: SampleLetter = 'A';
  isLoggedIn$: Observable<boolean>;
  guesses: { [key in SampleLetter]: SampleGuess };
  totalScore = 0;
  showResults = false;
  gameState: GameState | null = null;
  error: string | null = null;
  
  sampleStatus: Record<SampleLetter, SampleStatus> = {
    'A': { completed: false, validated: false, hasErrors: false },
    'B': { completed: false, validated: false, hasErrors: false },
    'C': { completed: false, validated: false, hasErrors: false },
    'D': { completed: false, validated: false, hasErrors: false }
  };

  loadingStates: LoadingStates = {
    initializing: false,
    savingGuesses: false,
    submitting: false,
    sharingResults: false
  };

  private destroy$ = new Subject<void>();
  private autoSave$ = new Subject<void>();
  
  @Output() gameComplete = new EventEmitter<number>();

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute,
    private offlineQueue: OfflineQueueService,
    private validation: ValidationService,
    private dataCollection: DataCollectionService
  ) {
    this.isLoggedIn$ = this.authService.isAuthenticated();
    this.guesses = this.initializeGuesses();
    this.setupAutoSave();
  }

  ngOnInit() {
    this.loadingStates.initializing = true;
    this.initializeGame().finally(() => {
      this.loadingStates.initializing = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.autoSave$.complete();
  }

  private setupAutoSave() {
    this.autoSave$.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.saveProgress();
    });
  }

  private initializeGuesses(): { [key in SampleLetter]: SampleGuess } {
    return {
      'A': { age: null, proof: null, mashbill: '' },
      'B': { age: null, proof: null, mashbill: '' },
      'C': { age: null, proof: null, mashbill: '' },
      'D': { age: null, proof: null, mashbill: '' }
    };
  }

  setSample(letter: SampleLetter) {
    if (this.canNavigateToSample(letter)) {
      this.currentSample = letter;
      this.dataCollection.logEvent('sample_change', { 
        sample: letter,
        timestamp: Date.now()
      });
      this.validateCurrentSample();
    } else {
      this.handleError('Please complete the current sample first');
    }
  }

  canNavigateToSample(letter: SampleLetter): boolean {
    const currentIdx = this.sampleLetters.indexOf(this.currentSample);
    const targetIdx = this.sampleLetters.indexOf(letter);
    
    // Can always go back or to current sample
    if (targetIdx <= currentIdx) return true;
    
    // Can go forward only if previous sample is completed
    return this.sampleLetters
      .slice(0, targetIdx)
      .every(l => this.sampleStatus[l].completed);
  }

  private async initializeGame() {
    try {
      const gameData = await this.loadSampleData();
      if (gameData && !this.validation.isValidGameData(gameData)) {
        throw new Error('Invalid game data');
      }
      this.gameState = gameData;
      if (gameData?.guesses) {
        this.restoreGuesses(gameData.guesses);
      }
      await this.offlineQueue.processQueue();
      this.validateAllSamples();
    } catch (error) {
      console.error('Error initializing game:', error);
      this.handleError('Unable to initialize game');
    }
  }

  private restoreGuesses(savedGuesses: { [key: string]: SampleGuess }) {
    Object.entries(savedGuesses).forEach(([key, guess]) => {
      if (this.sampleLetters.includes(key as SampleLetter)) {
        this.guesses[key as SampleLetter] = guess;
        this.validateSample(key as SampleLetter);
      }
    });
  }

  private validateSample(letter: SampleLetter) {
    const guess = this.guesses[letter];
    const status = this.sampleStatus[letter];
    
    status.validated = true;
    status.hasErrors = false;
    status.errorMessage = '';

    if (!guess.age || guess.age < 0 || guess.age > 30) {
      status.hasErrors = true;
      status.errorMessage = 'Please enter a valid age (0-30 years)';
    }
    
    if (!guess.proof || guess.proof < 80 || guess.proof > 160) {
      status.hasErrors = true;
      status.errorMessage = 'Please enter a valid proof (80-160)';
    }
    
    if (!guess.mashbill) {
      status.hasErrors = true;
      status.errorMessage = 'Please select a mashbill type';
    }

    status.completed = !status.hasErrors;
    this.autoSave$.next();
  }

  validateCurrentSample() {
    this.validateSample(this.currentSample);
  }

  validateAllSamples() {
    this.sampleLetters.forEach(letter => this.validateSample(letter));
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

  canSubmit(): boolean {
    return this.sampleLetters.every(letter => this.sampleStatus[letter].completed) &&
           !this.loadingStates.submitting;
  }

  async submitGuesses() {
    if (!this.canSubmit()) return;

    try {
      this.loadingStates.submitting = true;
      const score = await this.gameService.calculateScore(this.guesses);
      this.totalScore = score.totalScore;
      this.showResults = true;
      this.gameComplete.emit(this.totalScore);

      if (this.gameState?.quarterId) {
        await this.saveScore(this.gameState.quarterId);
      }
    } catch (error) {
      console.error('Error submitting guesses:', error);
      this.handleError('Unable to submit guesses');
    } finally {
      this.loadingStates.submitting = false;
    }
  }

  private async saveScore(quarterId: string) {
    try {
      await this.firebaseService.saveScore(quarterId, 'player', this.totalScore);
    } catch (error) {
      console.error('Error saving score:', error);
      this.dataCollection.logError('Non-critical: Error saving score');
    }
  }

  private async saveProgress() {
    if (!this.gameState?.quarterId) return;

    try {
      this.loadingStates.savingGuesses = true;
      await this.gameService.saveGameProgress(this.gameState.quarterId, {
        guesses: this.guesses,
        currentSample: this.currentSample,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      this.loadingStates.savingGuesses = false;
    }
  }

  async share() {
    this.loadingStates.sharingResults = true;
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
    } finally {
      this.loadingStates.sharingResults = false;
    }
  }

  resetSample(letter: SampleLetter) {
    this.guesses[letter] = { age: null, proof: null, mashbill: '' };
    this.validateSample(letter);
  }

  private handleError(message: string) {
    this.error = message;
    this.dataCollection.logError(message);
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  getProgressPercentage(): number {
    const completed = this.sampleLetters.filter(
      letter => this.sampleStatus[letter].completed
    ).length;
    return (completed / this.sampleLetters.length) * 100;
  }
}