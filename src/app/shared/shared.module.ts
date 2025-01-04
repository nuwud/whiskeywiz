import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { GameModule } from './game/game.module';
import { GameBannerComponent } from './components/game-banner/game-banner.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { ResultsComponent } from './results/results.component';

const COMPONENTS = [
  GameBannerComponent,
  StarRatingComponent,
  ResultsComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    GameModule
  ],
  exports: [
    ...COMPONENTS,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    GameModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }