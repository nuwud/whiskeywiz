import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

@NgModule({
  declarations: [
    GameComponent,
    LeaderboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    GameComponent,
    LeaderboardComponent,
    FormsModule
  ]
})
export class SharedModule { }