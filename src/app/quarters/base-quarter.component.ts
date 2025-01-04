import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { catchError, takeUntil, map } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { Quarter } from '../shared/models/quarter.model';
import { FirebaseApp } from '@angular/fire/app';
import { FIREBASE_APP } from '../app.module';
import { AnalyticsService } from '../services/analytics.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: "app-base-quarter",
  template: `
    <app-game-banner 
      [quarterId]="quarterId"
      [quarterName]="quarterData?.name || getDefaultQuarterName()">
    </app-game-banner>
  `,
  styles: []
})
export class BaseQuarterComponent implements OnInit, OnDestroy {
  @Input() quarterId!: string;
  protected readonly destroyed$ = new Subject<void>();
  protected app: FirebaseApp;

  quarterData: Quarter | null = null;
  guess: { age: number; proof: number; mashbill: string } = { age: 0, proof: 0, mashbill: "" };
  isGuest: boolean = true;
  playerId: string = "guest";
  gameCompleted = false;
  playerScore: number = 0;

  constructor(
    @Inject(FIREBASE_APP) app: FirebaseApp,
    protected firebaseService: FirebaseService,
    protected authService: AuthService,
    protected analyticsService: AnalyticsService
  ) {
    this.app = app;
    if (!this.app) {
      throw new Error("Firebase app not initialized");
    }
  }

  ngOnInit() {
    this.initializePlayer().pipe(
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  protected submitGuess(guess: any) {
    if (!this.quarterData) return;
    
    let score = 0;
    const actualSample = this.quarterData.samples["sample1"];

    const ageDiff = Math.abs(actualSample.age - guess.age);
    if (ageDiff === 0) {
      score += 30;
    } else {
      score += Math.max(0, 20 - (ageDiff * 4));
    }

    const proofDiff = Math.abs(actualSample.proof - guess.proof);
    if (proofDiff === 0) {
      score += 30;
    } else {
      score += Math.max(0, 20 - (proofDiff * 2));
    }

    if (guess.mashbill === actualSample.mashbill) {
      score += 10;
    }

    this.gameCompleted = true;
    this.playerScore = score;
  }

  protected initializePlayer(): Observable<void> {
    return this.authService.getCurrentUserId().pipe(
      catchError(error => {
        console.error("Error getting user ID:", error);
        return of(null);
      }),
      map(userId => {
        if (userId) {
          this.isGuest = false;
          this.playerId = userId;
        } else {
          this.isGuest = true;
          this.playerId = "guest_" + Math.random().toString(36).substr(2, 9);
        }
      })
    );
  }

  protected getDefaultQuarterName(): string {
    if (!this.quarterId) return "Whiskey Wiz Challenge";
    
    const month = parseInt(this.quarterId.substring(0, 2));
    const year = "20" + this.quarterId.substring(2, 2);
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
    
    return `${monthNames[month - 1]} ${year}`;
  }
}