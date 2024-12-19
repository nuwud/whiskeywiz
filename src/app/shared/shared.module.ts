import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { ResultsComponent } from './results/results.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { HermonaButtonComponent } from './components/hermona-button/hermona-button.component';
import { GameBannerComponent } from './components/game-banner/game-banner.component';

@NgModule({
  declarations: [
    GameComponent,
    GameBannerComponent,
    ResultsComponent,
    HermonaButtonComponent,
    StarRatingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    GameComponent,
    GameBannerComponent,
    ResultsComponent,
    FormsModule,
    CommonModule,
    HermonaButtonComponent,
    StarRatingComponent
  ]
})
export class SharedModule { }