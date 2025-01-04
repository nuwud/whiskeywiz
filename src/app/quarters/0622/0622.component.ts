import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { AnalyticsService } from '../../services/analytics.service';
import { GameService } from '../../services/game.service';
import { BaseQuarterComponent } from '../base-quarter.component';

@Component({
  selector: 'app-quarter-0622',
  template: `<ng-container *ngTemplateOutlet="baseQuarter.template"></ng-container>`
})
export class Q0622Component extends BaseQuarterComponent {
  constructor(
    protected override firebaseService: FirebaseService,
    protected override authService: AuthService,
    protected override analyticsService: AnalyticsService,
    protected override gameService: GameService
  ) {
    super(firebaseService, authService, analyticsService, gameService);
    this.quarterId = '0622';
    this.quarterName = 'Q2 2022';
  }
}