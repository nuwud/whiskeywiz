import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { ScoreResult, GameState, SampleGuess } from '../shared/models/game.model';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GameService {
  private currentState: GameState | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

  async loadGameData(): Promise<void> {
    try {
      // Load game data from Firebase
      const data = await this.firebaseService.loadQuarterData();
      this.currentState = {
        currentSample: 'A',
        guesses: {},
        isComplete: false,
        lastUpdated: Date.now(),
        quarterId: data.id
      };
    } catch (error) {
      console.error('Error loading game data:', error);
      throw error;
    }
  }

  async calculateScore(guesses: { [key: string]: SampleGuess }): Promise<ScoreResult> {
    try {
      // Get correct answers from Firebase
      const answers = await this.firebaseService.getQuarterAnswers();
      
      // Calculate scores
      const sampleScores: { [key: string]: number } = {};
      let totalScore = 0;

      Object.entries(guesses).forEach(([key, guess]) => {
        const answer = answers[key];
        let score = 0;

        // Age scoring
        if (Math.abs(guess.age - answer.age) <= 2) {
          score += 10 - (Math.abs(guess.age - answer.age) * 2);
        }

        // Proof scoring
        if (Math.abs(guess.proof - answer.proof) <= 5) {
          score += 10 - Math.abs(guess.proof - answer.proof);
        }

        // Mashbill scoring
        if (guess.mashbill === answer.mashbill) {
          score += 10;
        }

        sampleScores[key] = score;
        totalScore += score;
      });

      return { totalScore, sampleScores };
    } catch (error) {
      console.error('Error calculating score:', error);
      throw error;
    }
  }

  async saveGameProgress(playerId: string, state: GameState): Promise<void> {
    try {
      await this.firebaseService.saveGameState(playerId, state);
    } catch (error) {
      console.error('Error saving game progress:', error);
      throw error;
    }
  }
}
