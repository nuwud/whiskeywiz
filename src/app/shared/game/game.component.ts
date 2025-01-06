import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  currentSample = 'A';
  isLoggedIn$: Observable<boolean>;
  @Output() gameComplete = new EventEmitter<number>();

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.initializeGame();
  }

  private async initializeGame() {
    await this.loadSampleData();
    this.setupGameState();
  }

  private async loadSampleData() {
    try {
      const gameData = await this.gameService.loadGameData();
      // Implementation
    } catch (error) {
      console.error('Error loading game data:', error);
    }
  }

  private setupGameState() {
    // Game state setup implementation
  }

  async submitScore() {
    try {
      const score = await this.gameService.calculateScore(this.guesses);
      this.gameComplete.emit(score.totalScore);
      
      if (navigator.onLine) {
        await this.firebaseService.saveScore({
          score: score.totalScore,
          timestamp: Date.now()
        });
      } else {
        // Handle offline state
        console.log('Offline - score will be synced later');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  }
}
