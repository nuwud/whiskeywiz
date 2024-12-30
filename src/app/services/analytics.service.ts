import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { PlayerScore, Quarter } from '../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private analytics: AngularFireAnalytics) {}

  logGameStart(quarterId: string): void {
    this.analytics.logEvent('game_start', {
      quarterId,
      timestamp: new Date().toISOString()
    });
  }

  logGameComplete(quarterId: string, score: PlayerScore): void {
    this.analytics.logEvent('game_complete', {
      quarterId,
      score: score.score,
      playerId: score.playerId,
      timestamp: new Date().toISOString()
    });
  }

  logGuessSubmitted(quarterId: string, sampleNumber: number, guessData: any): void {
    this.analytics.logEvent('guess_submitted', {
      quarterId,
      sampleNumber,
      guessData,
      timestamp: new Date().toISOString()
    });
  }

  logQuarterActivated(quarter: Quarter): void {
    this.analytics.logEvent('quarter_activated', {
      quarterId: quarter.id,
      quarterName: quarter.name,
      timestamp: new Date().toISOString()
    });
  }

  logError(error: Error, context: string): void {
    this.analytics.logEvent('error_occurred', {
      errorMessage: error.message,
      errorName: error.name,
      context,
      timestamp: new Date().toISOString()
    });
  }
}