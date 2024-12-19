// src/app/quarters/quarter.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { BaseQuarterComponent } from './base-quarter.component';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-quarter',
  template: `
    <div class="quarter-wrapper">
      <div *ngIf="quarterData">
        <div class="game-container">
          <whiskey-wiz-game [quarter]="quarterId"></whiskey-wiz-game>
        </div>
        <div class="leaderboard-container">
          <app-leaderboard [quarterId]="quarterId"></app-leaderboard>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quarter-wrapper {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .game-container {
      margin-bottom: 2rem;
    }
    .leaderboard-container {
      margin-top: 2rem;
    }
  `]
})
export class QuarterComponent extends BaseQuarterComponent implements OnInit {
  constructor(
    firebaseService: FirebaseService,
    authService: AuthService
  ) {
    super(firebaseService, authService);
  }

  @Input() override quarterId: string = '';
  
  @Input() set quarter(value: string) {
    if (value.length === 4) {
      this.quarterId = value;
    } else {
      const [quarter, year] = value.split(' ');
      const month = ((parseInt(quarter.substring(1)) - 1) * 3 + 1).toString().padStart(2, '0');
      this.quarterId = `${month}${year.substring(2)}`;
    }
    // Call parent class initialization after setting quarterId
    this.initializePlayer();
  }
}
