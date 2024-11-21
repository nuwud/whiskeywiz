// src/app/services/game.service.ts

import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { GameState } from '../shared/models/game.model'; // Adjust the path as necessary
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentQuarterSubject = new BehaviorSubject<any>(null);
  currentQuarter$ = this.currentQuarterSubject.asObservable();
  private currentSample = new BehaviorSubject<number>(0);
  private gameState = new BehaviorSubject<GameState>({
    currentSample: 0,
    guesses: {},
    isComplete: false,
    scores: {},
    totalScore: 0 
  });
  private currentScores = new BehaviorSubject<{[key: string]: number}>({});
  scores$ = this.currentScores.asObservable();
  
  updateScore(sampleId: string, score: number) {
    const currentScores = this.currentScores.value;
    this.currentScores.next({
      ...currentScores,
      [sampleId]: score
    });
  }

  getTotalScore(): number {
    return Object.values(this.currentScores.value).reduce((sum, score) => sum + score, 0);
  }

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  loadQuarter(quarterId: string): void {
    this.firebaseService.getQuarterGameData(quarterId).subscribe(data => {
      this.currentQuarterSubject.next(data);
    });
  }

  shareScore(score: number, quarter: string) {
    const shareText = `I scored ${score} points in the Whiskey Wiz ${quarter} challenge!`;
    // Implement sharing logic here
  }

  navigateToSample(sampleIndex: number) {
    if (sampleIndex >= 0 && sampleIndex < 4) {
      this.currentSample.next(sampleIndex);
      // Save state if user is authenticated
      this.saveGameState();
    }
  }

  private lastPlayedQuarter = new BehaviorSubject<string>('');

  setLastPlayedQuarter(quarterId: string) {
    localStorage.setItem('lastPlayedQuarter', quarterId);
    this.lastPlayedQuarter.next(quarterId);
  }

  getLastPlayedQuarter(): Observable<string> {
    const stored = localStorage.getItem('lastPlayedQuarter');
    if (stored) {
      this.lastPlayedQuarter.next(stored);
    }
    return this.lastPlayedQuarter.asObservable();
  }

  navigateToGame(quarterId?: string) {
    const targetQuarter = quarterId || localStorage.getItem('lastPlayedQuarter') || '0124';
    return this.router.navigate(['/game'], {
      queryParams: { quarter: targetQuarter },
      replaceUrl: true
    });
  }

  saveGameState() {
    return this.authService.getCurrentUserId().pipe(
      switchMap(authId => {
        if (!authId) return of(null);
        const currentState = this.gameState.value;
        return this.firebaseService.gameProgressSet(authId, currentState);
      })
    ).subscribe();
  }
}