// src/app/services/game.service.ts

import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentQuarterSubject = new BehaviorSubject<any>(null);
  currentQuarter$ = this.currentQuarterSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {}

  loadQuarter(quarterId: string): void {
    this.firebaseService.getQuarterGameData(quarterId).subscribe(data => {
      this.currentQuarterSubject.next(data);
    });
  }

  shareScore(score: number, quarter: string) {
    const shareText = `I scored ${score} points in the Whiskey Wiz ${quarter} challenge!`;
    // Implement sharing logic here
  }
}