import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { AnalyticsService } from '../../services/analytics.service';
import { BaseQuarterComponent } from '../base-quarter.component';

@Component({
  selector: 'app-0122',
  template: '<ng-container *ngTemplateOutlet="template"></ng-container>'
})
export class Q0122Component extends BaseQuarterComponent {
  constructor(
    firebaseService: FirebaseService,
    authService: AuthService,
    gameService: GameService,
    analyticsService: AnalyticsService
  ) {
    super(firebaseService, authService, gameService, analyticsService);
  }
}
