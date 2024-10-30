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

  submitGuesses(guesses: any): Observable<number> {
    return new Observable(observer => {
      const currentQuarter = this.currentQuarterSubject.value;
      if (!currentQuarter) {
        observer.error('No quarter data loaded');
        return;
      }

      let totalScore = 0;
      Object.keys(guesses).forEach(sampleKey => {
        const guess = guesses[sampleKey];
        const actual = currentQuarter[sampleKey];
        let sampleScore = 0;

        if (guess.mashbill === actual.mashbill) sampleScore += 10;
        sampleScore += 10 - Math.abs(guess.proof - actual.proof);
        sampleScore += 10 - Math.abs(guess.age - actual.age);

        totalScore += sampleScore;
      });

      observer.next(totalScore);
      observer.complete();
    });
  }

  shareScore(score: number, quarter: string) {
    const shareText = `I scored ${score} points in the Whiskey Wiz ${quarter} challenge!`;
    // Implement sharing logic here
  }
}