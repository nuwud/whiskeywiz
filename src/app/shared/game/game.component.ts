import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap, catchError } from 'rxjs/operators';
import { ScoringService } from '../../services/scoring.service';
import { AnalyticsService } from '../../services/analytics.service';
import { FirebaseService } from '../../services/firebase.service';
import { Quarter, Sample } from '../models/quarter.model';
import { GameState, createInitialGameState } from '../models/game-state.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  quarterId: string | null = null;
  quarter: Quarter | null = null;
  gameState: GameState | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private firebase: FirebaseService,
    private scoring: ScoringService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.quarterId = params['quarter'] || null;
        if (this.quarterId) {
          this.initializeGame(this.quarterId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeGame(quarterId: string): void {
    this.firebase.getQuarterById(quarterId)
      .pipe(
        tap(quarter => {
          if (!quarter) {
            throw new Error(`Quarter ${quarterId} not found`);
          }
          this.quarter = quarter;
          this.gameState = createInitialGameState(quarterId);
          this.analytics.logGameStart(quarterId);
        }),
        catchError(error => {
          this.error = `Failed to initialize game: ${error.message}`;
          this.analytics.logError(error, 'gameInitialization');
          throw error;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  submitGuess(sampleNumber: number, guess: any): void {
    if (!this.gameState || !this.quarterId) return;

    const sampleKey = `sample${sampleNumber}` as const;
    this.gameState.guesses[sampleKey] = guess;
    this.analytics.logGuessSubmitted(this.quarterId, sampleNumber, guess);

    if (this.isGameComplete()) {
      this.completeGame();
    } else {
      this.saveGameProgress();
    }
  }

  private isGameComplete(): boolean {
    if (!this.gameState) return false;
    return Object.keys(this.gameState.guesses).length === 4;
  }

  private completeGame(): void {
    if (!this.gameState || !this.quarterId) return;

    const finalScore = {
      playerId: 'guest', // TODO: Get from auth service
      playerName: 'Guest Player',
      score: this.gameState.totalScore,
      quarterId: this.quarterId,
      isGuest: true
    };

    this.scoring.submitScore(finalScore)
      .pipe(
        tap(() => this.analytics.logGameComplete(this.quarterId!, finalScore)),
        catchError(error => {
          this.error = `Failed to submit score: ${error.message}`;
          this.analytics.logError(error, 'scoreSubmission');
          throw error;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private saveGameProgress(): void {
    if (!this.gameState || !this.quarterId) return;

    this.gameState.lastUpdated = new Date();
    this.firebase.updateGameProgress(this.quarterId, this.gameState)
      .pipe(
        catchError(error => {
          this.error = `Failed to save progress: ${error.message}`;
          this.analytics.logError(error, 'saveProgress');
          throw error;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}