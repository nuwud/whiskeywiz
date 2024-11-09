import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ResultsComponent } from './results/results.component';
import { HermonaButtonComponent } from './components/hermona-button/hermona-button.component';
import { GameBannerComponent } from './components/game-banner/game-banner.component';

@NgModule({
  declarations: [
    GameComponent,
    GameBannerComponent,
    LeaderboardComponent,
    HermonaButtonComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    GameComponent,
    GameBannerComponent,
    LeaderboardComponent,
    ResultsComponent,
    FormsModule,
    CommonModule,
    HermonaButtonComponent
  ]
})
export class SharedModule { }