import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';
import { ResultsComponent } from './results/results.component';
import { GameBannerComponent } from './components/game-banner/game-banner.component';
import { HermonaButtonComponent } from './components/hermona-button/hermona-button.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';

@NgModule({
  declarations: [
    GameComponent,
    ResultsComponent,
    GameBannerComponent,
    HermonaButtonComponent,
    StarRatingComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    GameComponent,
    ResultsComponent,
    GameBannerComponent,
    HermonaButtonComponent,
    StarRatingComponent,
    FormsModule
  ]
})
export class SharedModule { }