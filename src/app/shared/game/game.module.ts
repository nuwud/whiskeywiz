import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameComponent } from './game.component';
import { StarRatingComponent } from '../components/star-rating/star-rating.component';
import { ResultsComponent } from '../results/results.component';

@NgModule({
  declarations: [
    GameComponent,
    StarRatingComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule
  ],
  exports: [
    GameComponent,
    StarRatingComponent,
    ResultsComponent
  ]
})
export class GameModule { }