import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { OfflineQueueService } from '../../services/offline-queue.service';
import { ValidationService } from '../../services/validation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  @Input() quarterId: string = '';
  @Output() gameComplete = new EventEmitter<number>();

  // ... [Previous properties remain unchanged]

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private offlineQueue: OfflineQueueService,
    private validationService: ValidationService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.initializeGame();
  }

  async submitGuesses(): Promise<void> {
    try {
      const validation = this.validationService.validateQuarter(this.quarterId);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }

      const score = await this.gameService.calculateScore(this.guesses);
      this.scores = score.sampleScores;
      this.totalScore = score.totalScore;
      this.gameCompleted = true;
      this.showResults = true;
      this.gameComplete.emit(this.totalScore);
    } catch (error) {
      console.error('Error submitting guesses:', error);
      // Handle error display to user
    }
  }

  async submitScore(): Promise<void> {
    try {
      await this.offlineQueue.enqueueScore(this.quarterId, this.totalScore);
    } catch (error) {
      console.error('Error queueing score:', error);
      // Handle error display to user
    }
  }

  // ... [Rest of the component remains unchanged]
}

// FOR_CLAUDE: Updated with offline queue integration