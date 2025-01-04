import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game/game.component';
import { GameBannerComponent } from './components/game-banner/game-banner.component';
import { HermonaButtonComponent } from './components/hermona-button/hermona-button.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { ResultsComponent } from './results/results.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GameComponent,
    GameBannerComponent,
    HermonaButtonComponent,
    StarRatingComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    GameComponent,
    GameBannerComponent,
    HermonaButtonComponent,
    StarRatingComponent,
    ResultsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this to support web components
})
export class SharedModule { }