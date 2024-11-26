import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnDestroy,
  ChangeDetectorRef 
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Quarter } from '../models/quarter.model';
import { GameGuess } from '../models/game.model';
import { ScoreService } from '../../services/score.service';
import { GameService } from '../../services/game.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface SampleGuess {
  age: number;
  proof: number;
  mashbill: string;
  rating?: number;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  @Input() quarterData: Quarter | null = null;
  @Input() guesses: { [key: string]: SampleGuess } = {};
  @Input() scores: { [key: string]: number } = {};
  @Input() totalScore: number = 0;
  @Input() showRatings: boolean = true;

  @Output() playAgain = new EventEmitter<void>();
  @Output() shareResults = new EventEmitter<void>();
  @Output() submitScore = new EventEmitter<void>();

  isLoading: boolean = false;
  error: string | null = null;
  sampleNumbers: number[] = [1, 2, 3, 4];
  private destroy$ = new Subject<void>();
  private navigationInProgress = false;
  
  // Button hover states
  shareHovered: boolean = false;
  playAgainHovered: boolean = false;
  leaderboardHovered: boolean = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private gameService: GameService,
    public scoreService: ScoreService
  ) {}

  ngOnInit(): void {
    this.validateInputs();
    this.setupNavigationHandling();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupNavigationHandling(): void {
    // Monitor route changes to reset navigation lock
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.navigationInProgress = false;
      });
  }

  private validateInputs(): void {
    if (!this.quarterData) {
      console.error('Quarter data is missing');
      this.error = 'Unable to load game results';
    }
    if (!this.guesses || Object.keys(this.guesses).length === 0) {
      console.error('Guesses data is missing');
      this.error = 'Unable to load game results';
    }
  }

  getSampleScore(sampleNum: number): number {
    return this.scores[`sample${sampleNum}`] || 0;
  }

  getGuessValue(sampleNum: number, field: keyof SampleGuess): any {
    const guess = this.guesses[`sample${sampleNum}`];
    return guess ? guess[field] : this.getDefaultValue(field);
  }

  getActualValue(sampleNum: number, field: keyof SampleGuess): any {
    const sample = this.quarterData?.samples[`sample${sampleNum}`];
    return sample ? sample[field] : this.getDefaultValue(field);
  }

  private getDefaultValue(field: keyof SampleGuess): any {
    switch (field) {
      case 'age':
      case 'proof':
      case 'rating':
        return 0;
      case 'mashbill':
        return 'Unknown';
      default:
        return null;
    }
  }

  getButtonImage(baseName: string, isHovered: boolean): string {
    const suffix = isHovered ? '_hover' : '';
    return `assets/images/${baseName}${suffix}.png`;
  }

  async handleShare(): Promise<void> {
    try {
      this.isLoading = true;
      const shareText = this.generateShareText();
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Whiskey Wiz Score',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        // You might want to show a toast notification here
        this.showMessage('Results copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing results:', error);
      this.error = 'Unable to share results';
    } finally {
      this.isLoading = false;
    }
  }

  private generateShareText(): string {
    const emojiScores = this.sampleNumbers.map(num => 
      this.scoreService.getEmojiScore(this.getSampleScore(num))
    );
    
    return `Whiskey Wiz Score: ${this.totalScore}\n${emojiScores.join('')}`;
  }

  async handlePlayAgain(): Promise<void> {
    if (this.isLoading || this.navigationInProgress) return;
    
    try {
      this.isLoading = true;
      this.navigationInProgress = true;
      const quarterId = await this.getQuarterId();
      
      // Use game service to handle play again
      await this.gameService.handlePlayAgain(quarterId);
      this.playAgain.emit();
    } catch (error) {
      console.error('Error starting new game:', error);
      this.error = 'Unable to start new game';
    } finally {
      this.isLoading = false;
      this.navigationInProgress = false;
    }
  }

  async handleLeaderboard(): Promise<void> {
    if (this.isLoading || this.navigationInProgress) return;
    
    try {
      this.isLoading = true;
      this.navigationInProgress = true;
      const quarterId = await this.getQuarterId();
      
      // Use game service for navigation
      await this.gameService.navigateToLeaderboard(quarterId);
    } catch (error) {
      console.error('Error navigating to leaderboard:', error);
      this.error = 'Unable to view leaderboard';
    } finally {
      this.isLoading = false;
      this.navigationInProgress = false;
    }
  }

  private async getQuarterId(): Promise<string> {
    // Try multiple sources for quarter ID
    const quarterId = this.quarterData?.id || 
                    this.route.snapshot.queryParamMap.get('quarter') ||
                    localStorage.getItem('lastPlayedQuarter');

    if (!quarterId) {
      throw new Error('No quarter ID available');
    }
    
    return quarterId;
  }

  private showMessage(message: string, duration: number = 3000): void {
    this.error = null;
    // TODO: Implement toast notification
    console.log(message);
  }

  // Error handling display method
  showError(message: string): void {
    this.error = message;
    setTimeout(() => {
      this.error = null;
      this.changeDetectorRef.detectChanges();
    }, 5000);
  }
}