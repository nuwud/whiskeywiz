import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ResultsComponent } from './results/results.component';

@NgModule({
  declarations: [
    GameComponent,
    LeaderboardComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    GameComponent,
    LeaderboardComponent,
    ResultsComponent,
    FormsModule,
    CommonModule
  ]
})
export class SharedModule { }