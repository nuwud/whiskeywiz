import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  template: ''
})
export class BaseQuarterComponent {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(
    protected firebaseService: FirebaseService,
    protected authService: AuthService,
    protected gameService: GameService,
    protected analyticsService: AnalyticsService
  ) {}
}
