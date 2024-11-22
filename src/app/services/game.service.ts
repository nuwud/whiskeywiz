import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { GameState } from '../shared/models/game.model'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentQuarterSubject = new BehaviorSubject<any>(null);
  currentQuarter$ = this.currentQuarterSubject.asObservable();
  private gameState = new BehaviorSubject<GameState>({
    currentSample: 0,
    guesses: {},
    isComplete: false,
    scores: {},
    totalScore: 0 
  });
  private currentScores = new BehaviorSubject<{[key: string]: number}>({});
  scores$ = this.currentScores.asObservable();
  
  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  updateScore(sampleId: string, score: number): void {
    const currentScores = this.currentScores.value;
    this.currentScores.next({
      ...currentScores,
      [sampleId]: score
    });
  }

  getTotalScore(): number {
    return Object.values(this.currentScores.value).reduce((sum, score) => sum + score, 0);
  }

  loadQuarter(quarterId: string): void {
    this.firebaseService.getQuarterGameData(quarterId).subscribe(data => {
      this.currentQuarterSubject.next(data);
    });
  }

  shareScore(score: number, quarter: string): void {
    const shareText = `I scored ${score} points in the Whiskey Wiz ${quarter} challenge!`;
    // Implement sharing logic here
  }

  navigateToSample(sampleIndex: number): void {
    if (sampleIndex >= 0 && sampleIndex < 4) {
      this.gameState.next({
        ...this.gameState.value,
        currentSample: sampleIndex
      });
      this.saveGameProgress();
    }
  }

  private saveGameProgress(): void {
    this.authService.getCurrentUserId().pipe(
      take(1),
      switchMap(authId => {
        if (!authId) return of(null);
        return this.firebaseService.gameProgressSet(authId, this.gameState.value);
      })
    ).subscribe();
  }

  loadQuarterData(quarterId: string) {
    return this.firebaseService.getQuarterById(quarterId);
  }

  navigateToGame(quarterId: string) {
    if (!quarterId) return;
    
    localStorage.setItem('lastPlayedQuarter', quarterId);
    return this.router.navigate(['/game'], {
      queryParams: { quarter: quarterId }
    });
  }

  navigateToLeaderboard(quarterId: string) {
    return this.router.navigate(['/leaderboard'], {
      queryParams: { quarter: quarterId }
    });
  }
}