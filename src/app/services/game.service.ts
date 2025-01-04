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

  async loadQuarter(mmyy: string): Promise<void> {
    try {
      const quarter = await this.firebaseService.getQuarterById(mmyy)
        .pipe(take(1))
        .toPromise();
        
      if (quarter) {
        this.currentQuarter.next(quarter);
        localStorage.setItem('lastPlayedQuarter', mmyy);
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

  async navigateToGame(mmyy: string): Promise<boolean> {
    if (this.navigationLock || !this.isValidMMYY(mmyy)) return false;
    
    try {
      this.navigationLock = true;
      
      // Clear existing game state
      localStorage.removeItem(`gameState_${mmyy}`);
      this.clearGameState();
      
      // Navigate using MMYY format
      return await this.router.navigate(['/quarters', mmyy]);
    } finally {
      this.navigationLock = false;
    }
  }

  async handlePlayAgain(mmyy: string): Promise<void> {
    if (this.navigationLock || !this.isValidMMYY(mmyy)) return;
    
    try {
      this.navigationLock = true;
      
      // Clear game state
      this.clearGameState();
      localStorage.removeItem(`gameState_${mmyy}`);
      
      // Load quarter and navigate
      await this.loadQuarter(mmyy);
      await this.navigateToGame(mmyy);
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

  private isValidMMYY(mmyy: string): boolean {
    if (!mmyy || mmyy.length !== 4) return false;
    const month = parseInt(mmyy.substring(0, 2));
    const year = parseInt(mmyy.substring(2, 4));
    return month >= 1 && month <= 12 && year >= 20 && year <= 99;
  }
}