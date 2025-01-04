import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { GameComponent } from './game/game.component';
import { GameBannerComponent } from './components/game-banner/game-banner.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { ResultsComponent } from './results/results.component';

// Services
import { DataCollectionService } from '../services/data-collection.service';
import { ScoreService } from '../services/score.service';
import { GameService } from '../services/game.service';

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
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [...COMPONENTS],
  providers: [
    DataCollectionService,
    ScoreService,
    GameService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }