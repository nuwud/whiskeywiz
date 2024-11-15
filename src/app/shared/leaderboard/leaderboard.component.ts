import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';
import { PlayerScore } from '../../shared/models/quarter.model';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-15px)' }),
          stagger(50, [
            animate('300ms ease-out', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class LeaderboardComponent implements OnInit, OnChanges {
  @Input() quarterId: string = '';
  leaderboard: PlayerScore[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  private retryCount = 0;
  private maxRetries = 3;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.quarterId) {
      this.loadLeaderboard();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['quarterId'] && this.quarterId) {
      this.loadLeaderboard();
    }
  }

  async loadLeaderboard() {
    this.isLoading = true;
    this.error = null;

    try {
      const scores = await firstValueFrom(this.firebaseService.getLeaderboard(this.quarterId));
      if (scores) {
        this.leaderboard = scores
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        this.retryCount = 0;
      }
    } catch (err) {
      this.handleError(err);
    } finally {
      this.isLoading = false;
    }
  }

  private handleError(error: any) {
    console.error('Leaderboard error:', error);
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.error = `Loading failed. Retrying... (${this.retryCount}/${this.maxRetries})`;
      setTimeout(() => this.loadLeaderboard(), 1000 * this.retryCount);
    } else {
      this.error = 'Failed to load leaderboard. Please try again later.';
    }
  }

  retry() {
    this.retryCount = 0;
    this.loadLeaderboard();
  }

  async isCurrentPlayer(playerId: string): Promise<boolean> {
    try {
      const currentId = await firstValueFrom(this.authService.getCurrentUserId());
      return currentId === playerId;
    } catch {
      return false;
    }
  }

}