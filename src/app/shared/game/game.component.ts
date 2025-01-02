import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameState, Guess } from '../models/game.model';
import { GameGuess } from '../../services/data-collection.service';

// ... other imports ...

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  // ... existing properties ...

  private convertGuessesToGameGuesses(guesses: { [key: string]: Guess }): { [key: string]: GameGuess } {
    const gameGuesses: { [key: string]: GameGuess } = {};
    
    for (const [key, guess] of Object.entries(guesses)) {
      gameGuesses[key] = {
        age: guess.age,
        proof: guess.proof,
        mashbill: guess.mashbill,
        rating: guess.rating || 0  // Provide default value for rating
      };
    }
    
    return gameGuesses;
  }

  async initializeGameSession(): Promise<void> {
    await this.dataCollectionService.initializeSession();
    this.startTime = Date.now();
  }

  recordGameInteraction(interaction: any): void {
    this.dataCollectionService.recordInteraction(interaction);
  }

  async finalizeGameSession(): Promise<void> {
    await this.dataCollectionService.finalizeSession();
  }

  async submitGame(): Promise<void> {
    try {
      const gameData = {
        quarterId: this.quarterId,
        guesses: this.convertGuessesToGameGuesses(this.guesses),
        scores: this.scores,
        ratings: Object.fromEntries(
          Object.entries(this.guesses).map(([key, guess]) => [key, guess.rating || 0])
        ),
        completionTime: Date.now() - this.startTime
      };
      
      await this.dataCollectionService.collectGameData(gameData);
      await this.dataCollectionService.finalizeSession();
      // Rest of your submitGame logic...
    } catch (error) {
      console.error('Error submitting game:', error);
      throw error;
    }
  }

  // ... rest of the component ...
}