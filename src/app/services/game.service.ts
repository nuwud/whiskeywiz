// src/app/services/game.service.ts

import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
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

  async saveGameState() {
    const authId = await this.authService.getCurrentUserId().toPromise();
    if (authId) {
      this.firebaseService.saveGameProgress(authId, this.gameState.value);
    }
  }
}