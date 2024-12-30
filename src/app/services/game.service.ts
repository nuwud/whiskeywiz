import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { map, switchMap, take, catchError, tap } from 'rxjs/operators';
import { GameState, Quarter } from '../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentQuarter = new BehaviorSubject<Quarter | null>(null);
  private gameState = new BehaviorSubject<GameState | null>(null);
  private navigationLock = false;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  getCurrentQuarter(): Observable<Quarter | null> {
    return this.currentQuarter.asObservable();
  }

  getCurrentQuarterId(): string | null {
    return this.currentQuarter.value?.id || null;
  }

  async loadQuarter(quarterId: string): Promise<void> {
    try {
      const quarter = await this.firebaseService.getQuarterById(quarterId)
        .pipe(take(1))
        .toPromise();
        
      if (quarter) {
        this.currentQuarter.next(quarter);
        localStorage.setItem('lastPlayedQuarter', quarterId);
      } else {
        throw new Error('Quarter not found');
      }
    } catch (error) {
      console.error('Error loading quarter:', error);
      throw error;
    }
  }

  clearGameState(): void {
    this.gameState.next(null);
    this.currentQuarter.next(null);
  }

  async navigateToGame(quarterId: string): Promise<boolean> {
    if (this.navigationLock) return false;
    
    try {
      this.navigationLock = true;
      
      // Clear existing game state
      localStorage.removeItem(`gameState_${quarterId}`);
      this.clearGameState();
      
      // Navigate to game
      return await this.router.navigate(['/game'], {
        queryParams: { quarter: quarterId },
        replaceUrl: true
      });
    } finally {
      this.navigationLock = false;
    }
  }

  async navigateToLeaderboard(quarterId: string): Promise<boolean> {
    if (this.navigationLock) return false;
    
    try {
      this.navigationLock = true;
      
      return await this.router.navigate(['/leaderboard'], {
        queryParams: { quarter: quarterId }
      });
    } finally {
      this.navigationLock = false;
    }
  }

  async handlePlayAgain(quarterId: string): Promise<void> {
    if (this.navigationLock) return;
    
    try {
      this.navigationLock = true;
      
      // Clear game state
      this.clearGameState();
      localStorage.removeItem(`gameState_${quarterId}`);
      
      // Load quarter and navigate
      await this.loadQuarter(quarterId);
      await this.navigateToGame(quarterId);
    } finally {
      this.navigationLock = false;
    }
  }

  getGameState(): Observable<GameState | null> {
    return this.gameState.asObservable();
  }

  saveGameState(state: GameState): Observable<void> {
    return this.authService.getPlayerId().pipe(
      take(1),
      switchMap(playerId => {
        if (!playerId) return throwError(() => new Error('No player ID'));
        return this.firebaseService.saveGameProgress(playerId, state);
      }),
      tap(() => this.gameState.next(state))
    );
  }
}