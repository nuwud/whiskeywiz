import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';  // Add ActivatedRoute import
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';
import { PlayerScore } from '../../shared/models/quarter.model';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { firstValueFrom, catchError, retry, timeout, of, Observable } from 'rxjs';
import { RetryConfig } from 'rxjs/internal/operators/retry';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-15px)' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
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
  private readonly TIMEOUT_MS = 10000;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute 

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
      const config: RetryConfig = {
        count: this.maxRetries,
        delay: (error, retryCount) => {
          this.retryCount = retryCount;
          return of(retryCount * 1000); // Return an Observable for delay
        }
      };

      const scores = await firstValueFrom(
        this.firebaseService.getLeaderboard(this.quarterId).pipe(
          timeout(this.TIMEOUT_MS),
          retry(config),
          catchError(error => {
            if (error.name === 'TimeoutError') {
              throw new Error('Request timed out. Please check your connection.');
            }
            throw error;
          })
        )
      );

      if (!scores || scores.length === 0) {
        this.leaderboard = [];
        this.error = 'No scores found for this quarter';
        return;
      }

      this.leaderboard = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      await this.submitScoreIfNeeded();
      
    } catch (err: any) {
      this.handleError(err);
    } finally {
      this.isLoading = false;
    }
  }

  private async submitScoreIfNeeded() {
    try {
      const currentPlayerId = await firstValueFrom(this.authService.getCurrentUserId());
      if (!currentPlayerId) return;

      const isPlayerInLeaderboard = this.leaderboard.some(
        score => score.playerId === currentPlayerId
      );

      if (!isPlayerInLeaderboard) {
        await this.submitScore(currentPlayerId);
      }
    } catch (error) {
      console.error('Error checking player score:', error);
    }
  }

  private async submitScore(currentUserId: string) {
    try {
      const user = await firstValueFrom(this.authService.user$);
      const playerScore: PlayerScore = {
        playerId: currentUserId,
        playerName: user?.email || 'Anonymous',
        score: 0, // Replace with actual score
        quarterId: this.quarterId,
        isGuest: !user // If no user object, treat as guest
      };

      await firstValueFrom(this.firebaseService.submitScore(playerScore));
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
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

  navigateBackToGame() {
    if (!this.quarterId) {
      // Try to get quarter ID from multiple sources
      this.quarterId = 
        localStorage.getItem('lastPlayedQuarter') || 
        this.route.snapshot.queryParams['quarter'];
  
      if (!this.quarterId) {
        console.error('No quarter ID found for navigation');
        this.router.navigate(['/game']);
        return;
      }
    }
  
    // Store quarter ID for future use
    localStorage.setItem('lastPlayedQuarter', this.quarterId);
    
    this.router.navigate(['/game'], { 
      queryParams: { quarter: this.quarterId }
    });
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