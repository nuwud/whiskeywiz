import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PlayerScore, ScoringRules } from '../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class ScoringService {
  constructor(private firebase: FirebaseService) {}

  submitScore(score: PlayerScore): Observable<void> {
    if (!this.validateScore(score)) {
      return throwError(() => new Error('Invalid score data'));
    }

    const scoreWithTimestamp = {
      ...score,
      timestamp: new Date(),
      playerId: score.playerId || 'guest',
      playerName: score.playerName || 'Guest Player'
    };
    
    return this.firebase.submitScore(scoreWithTimestamp).pipe(
      tap(() => console.log('Score submitted successfully')),
      catchError(error => {
        console.error('Error submitting score:', error);
        return throwError(() => new Error(`Failed to submit score: ${error.message}`));
      })
    );
  }

  getLeaderboard(quarterId: string): Observable<PlayerScore[]> {
    return this.firebase.getLeaderboard(quarterId).pipe(
      map(scores => this.sortAndValidateScores(scores)),
      catchError(error => {
        console.error('Error fetching leaderboard:', error);
        return throwError(() => new Error(`Failed to fetch leaderboard: ${error.message}`));
      })
    );
  }

  private validateScore(score: PlayerScore): boolean {
    return (
      typeof score.score === 'number' &&
      typeof score.quarterId === 'string' &&
      (!score.playerId || typeof score.playerId === 'string') &&
      (!score.playerName || typeof score.playerName === 'string')
    );
  }

  private sortAndValidateScores(scores: PlayerScore[]): PlayerScore[] {
    return scores
      .filter(this.validateScore)
      .sort((a, b) => b.score - a.score);
  }
}