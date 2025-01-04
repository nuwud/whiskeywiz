import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ResultsComponent } from './results/results.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { GameBannerComponent } from './components/game-banner/game-banner.component';
import { DataCollectionService } from '../services/data-collection.service';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';

@NgModule({
  declarations: [
    GameBannerComponent,
    ResultsComponent,
    StarRatingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AngularFireAnalyticsModule,
  ],
  exports: [
    GameBannerComponent,
    ResultsComponent,
    StarRatingComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    AngularFireAnalyticsModule
  ],
  providers: [
    DataCollectionService
  ]
})
export class SharedModule { }