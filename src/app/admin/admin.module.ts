import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service';
import { ScoreService } from '../services/score.service';

@NgModule({
  declarations: [
    AdminComponent,
    AnalyticsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AdminRoutingModule
  ],
  providers: [
    FirebaseService,
    AuthService,
    GameService,
    ScoreService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }