import { Component, Input, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { AnalyticsService } from '../services/analytics.service';
import { GameService } from '../services/game.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-base-quarter',
  template: `
    <div class="quarter-container" [class.embedded]="isEmbedded">
      <!-- Game Banner -->
      <app-game-banner
        [quarterId]="quarterId"
        [quarterName]="quarterName"
        [isEmbedded]="isEmbedded"
        (expand)="onExpand()">
      </app-game-banner>

      <!-- Game Content -->
      <ng-container *ngIf="!isEmbedded || (isEmbedded && isExpanded)">
        <app-game 
          [quarterId]="quarterId"
          (gameComplete)="onGameComplete($event)">
        </app-game>
      </ng-container>
    </div>
  `,
  styles: [`
    .quarter-container {
      width: 100%;
      min-height: 100px;
    }
    .quarter-container.embedded {
      height: auto;
      overflow: hidden;
    }
  `]
})
export class BaseQuarterComponent implements OnInit {
  @Input() quarterId: string = '';
  @Input() quarterName: string = '';
  @Input() isEmbedded: boolean = false;
  
  protected isExpanded: boolean = false;
  protected gameState$: Observable<any>;

  constructor(
    protected firebaseService: FirebaseService,
    protected authService: AuthService,
    protected analyticsService: AnalyticsService,
    protected gameService: GameService
  ) {
    this.gameState$ = this.gameService.getGameState();
  }

  async ngOnInit() {
    if (!this.isEmbedded) {
      await this.gameService.loadQuarter(this.quarterId);
    }
  }

  protected async submitGuess(guess: { age: number; proof: number; mashbill: string }) {
    if (!this.quarterId) {
      console.error('No quarter ID available');
      return;
    }

    try {
      await this.analyticsService.logEvent('guess_submitted', {
        quarterId: this.quarterId,
        ...guess
      });

      const state = {
        id: this.quarterId,
        guess,
        status: 'submitted'
      };

      await this.gameService.saveGameState(state);
    } catch (error) {
      console.error('Error submitting guess:', error);
    }
  }

  protected onExpand(): void {
    this.isExpanded = true;
    this.analyticsService.logEvent('quarter_expanded', {
      quarterId: this.quarterId
    });
  }

  protected onGameComplete(score: number): void {
    this.analyticsService.logEvent('game_completed', {
      quarterId: this.quarterId,
      score
    });
    // Handle game completion
  }

  protected isValidQuarter(): boolean {
    if (!this.quarterId || this.quarterId.length !== 4) return false;
    
    const month = parseInt(this.quarterId.substring(0, 2));
    const year = parseInt(this.quarterId.substring(2, 4));
    
    return month >= 1 && month <= 12 && year >= 20 && year <= 99;
  }
}