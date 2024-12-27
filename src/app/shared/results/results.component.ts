import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Quarter } from '../models/quarter.model';
import { GameGuess } from '../models/game.model';
import { DataCollectionService } from '../../services/data-collection.service';      
import { ScoreService } from '../../services/score.service';
import { GameService } from '../../services/game.service';
import { FieldValue } from '@angular/fire/firestore'; // Ensure this import is correct
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface SampleGuess {
  age: number;
  proof: number;
  mashbill: string;
  rating?: number;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
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
  showScoreDetails: boolean = false;
  showScoringInfo: boolean = false;
  videoUrl: string = 'https://youtu.be/tcqLTMiksDw?si=pcFL-64Aecc-oLC6';

  // Button hover states
  shareHovered: boolean = false;
  playAgainHovered: boolean = false;
  leaderboardHovered: boolean = false;

  private destroy$ = new Subject<void>();
  private navigationInProgress = false;
  private sessionStartTime: number = Date.now();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private gameService: GameService,
    public scoreService: ScoreService,
    private dataCollection: DataCollectionService
  ) { }

  ngOnInit(): void {
    this.validateInputs();
    this.setupNavigationHandling();
    this.loadVideo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVideo(): void {
    // Load video URL from quarter data if available
    this.videoUrl = this.quarterData?.videoUrl || '';
  }

  toggleScoreDetails(): void {
    this.showScoreDetails = !this.showScoreDetails;
  }

  toggleScoringInfo(): void {
    this.showScoringInfo = !this.showScoringInfo;
  }

  getScoringExplanation(): string {
    return `
      Scoring is calculated based on three factors:
      
      1. Age Statement (0-30 points):
          • Exact match: 30 points
          • Within 1 year: 20 points
          • Points decrease by 4 for each year off
      
      2. Proof (0-30 points):
          • Exact match: 30 points
          • Within 2 proof points: 20 points
          • Points decrease by 2 for each proof point off
      
      3. Mashbill Type (10 points):
          • Correct mashbill type: 10 points
          • Incorrect: 0 points
      
      Maximum possible score: 280 points (70 points per sample)
    `;
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

  getSampleLetter(num: number): string {
    return String.fromCharCode(64 + num); // Converts 1 to A, 2 to B, etc.
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

// Update handleShare
async handleShare(): Promise<void> {
  try {
    this.isLoading = true;
    await this.dataCollection.recordInteraction('share_attempt');
    const shareText = this.generateShareText();
    
    if (navigator.share) {
      await navigator.share({
        title: 'My Whiskey Wiz Score',
        text: shareText,
        url: window.location.href
      });
      await this.dataCollection.recordInteraction('share_success', { method: 'native' });
    } else {
      await navigator.clipboard.writeText(shareText);
      await this.dataCollection.recordInteraction('share_success', { method: 'clipboard' });
    }
  } catch (err) {
    const error = err as Error;
    await this.dataCollection.recordInteraction('share_failed', { error: error.message });
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
    // TODO: Implement toast notification here if desired
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

  // Helper method to determine if a guess was perfect
  isPerfectGuess(sampleNum: number): boolean {
    return this.getSampleScore(sampleNum) === 70; // Maximum possible score per sample
  }
}