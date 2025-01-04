import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { GameComponent } from './game/game.component';
import { GameBannerComponent } from './components/game-banner/game-banner.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { ResultsComponent } from './results/results.component';

const COMPONENTS = [
  GameComponent,
  GameBannerComponent,
  StarRatingComponent,
  ResultsComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [...COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
