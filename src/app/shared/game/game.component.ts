import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { OfflineQueueService } from '../../services/offline-queue.service';
import { ValidationService } from '../../services/validation.service';
import { Observable, from } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { DataCollectionService } from '../../services/data-collection.service';

interface SampleGuess {
  age: number;
  proof: number;
  mashbill: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Input() quarterId: string = '';
  @Output() gameComplete = new EventEmitter<number>();

  // ... [Previous properties remain unchanged]
  isLoggedIn$: Observable<boolean>;
  isGuest: boolean = false;
  guesses: { [key: string]: SampleGuess } = {};
  currentSample: number = 0;
  scores: { [key: string]: number } = {};
  totalScore: number = 0;
  starRatings: { [key: string]: number } = {};
  quarterData: any;
  gameCompleted: boolean = false;
  showResults: boolean = false;
  sampleButtons = ['A', 'B', 'C', 'D'];
  mashbillTypes = ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Specialty'];
  sessionStartTime: number = Date.now();

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private offlineQueue: OfflineQueueService,
    private validationService: ValidationService,
    private router: Router,
    private dataCollection: DataCollectionService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.initializeGame();
  }
  async ngOnInit() {
    throw new Error('Method not implemented.');
    await this.loadQuarterData();
    await this.dataCollection.initializeSession(this.quarterId).toPromise();
  }
  
  private async loadQuarterData(): Promise<void> {
    if (!this.isValidQuarter(this.quarterId)) {
      this.handleError('Invalid quarter ID');
      return;
    }

    try {
      this.quarterData = await this.gameService.loadQuarter(this.quarterId);
    } catch (error) {
      this.handleError('Error loading quarter data');
    }
  }

    try {
      this.quarterData = await this.gameService.loadQuarter(this.quarterId);
    } catch (error) {
      this.handleError('Error loading quarter data');
    }
  }

  private initializeGame(): void {
    this.guesses = {
      'sampleA': { age: 0, proof: 0, mashbill: '' },
      'sampleB': { age: 0, proof: 0, mashbill: '' },
      'sampleC': { age: 0, proof: 0, mashbill: '' },
      'sampleD': { age: 0, proof: 0, mashbill: '' }
    };
    this.initializeRatings();
  }

  private initializeRatings(); void {
    this.starRatings = {
      'sampleA': 0,
      'sampleB': 0,
      'sampleC': 0,
      'sampleD': 0
    };
  }

  getQuarterTitle(): string {
    return `Quarter ${this.quarterId}`;
  }

  selectSample(index: number): void {
    this.currentSample = index;
    this.updateSampleCompletion(index);
  }

  getSampleLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D
  }

  getSampleAriaLabel(num: number): string {
    return `Sample ${this.getSampleLetter(num - 1)}`;
  }

  getSampleData(index: number): any {
    return this.quarterData?.samples?.[`sample${this.getSampleLetter(index)}`];
  }

  updateStarRating(sample: number, rating: number): void {
    this.starRatings[`sample${this.getSampleLetter(sample)}`] = rating;
    this.updateSampleCompletion(sample);
  }

  updateSampleCompletion(index: number): void {
    const sampleLetter = this.getSampleLetter(index);
    const guess = this.guesses[`sample${sampleLetter}`];
    const hasAllGuesses = guess.age > 0 && guess.proof > 0 && guess.mashbill !== '';
    const hasRating = this.starRatings[`sample${sampleLetter}`] > 0;
    
    if (hasAllGuesses && hasRating) {
      this.dataCollection.recordInteraction('sample_completed', {
        sample: sampleLetter,
        quarterId: this.quarterId
      });
    }
  }

  showSubmitAllButton(): boolean {
    return Object.values(this.guesses).every(guess => 
      guess.age > 0 && guess.proof > 0 && guess.mashbill !== '');
  }

  async submitGuesses(): Promise<void> {
    try {
      const score = await this.gameService.calculateScore(this.guesses);
      this.scores = score.sampleScores;
      this.totalScore = score.totalScore;
      this.gameCompleted = true;
      this.showResults = true;
      
      const completionTime = Date.now() - this.sessionStartTime;
      await this.dataCollection.finalizeSession(
        this.quarterId,
        this.authService.getCurrentUserId(),
        this.totalScore,
        true
      ).toPromise();
      
      this.gameComplete.emit(this.totalScore);
    } catch (error) {
      this.handleError('Error submitting guesses');
    }
  }

  async submitScore(): Promise<void> {
    try {
      await this.gameService.submitScore(this.quarterId, this.totalScore);
    } catch (error) {
      this.handleError('Error submitting score');
    }
  }

  share(): void {
    this.dataCollection.recordInteraction('share_attempt');
    if (navigator.share) {
      navigator.share({
        title: 'My Whiskey Wiz Score',
        text: `I scored ${this.totalScore} points in Quarter ${this.quarterId}!`,
        url: window.location.href
      }).then(() => {
        this.dataCollection.recordInteraction('share_success', { method: 'native' });
      }).catch((error) => {
        this.fallbackShare();
      });
    } else {
      this.fallbackShare();
    }
  }

  private fallbackShare(): void {
    const text = `I scored ${this.totalScore} points in Quarter ${this.quarterId}!`;
    navigator.clipboard.writeText(text).then(() => {
      this.dataCollection.recordInteraction('share_success', { method: 'clipboard' });
      alert('Score copied to clipboard!');
    }).catch(() => {
      this.handleError('Unable to share score');
    });
  }

  playAgain(): void {
    this.initializeGame();
    this.gameCompleted = false;
    this.showResults = false;
    this.sessionStartTime = Date.now();
  }

  handleAuth(): void {
    if (this.isGuest) {
      this.authService.login();
    } else {
      this.authService.logout();
    }
  }

  getImagePath(filename: string): string {
    return `assets/images/${filename}`;
  }

  private isValidQuarter(quarterId: string): boolean {
    if (!quarterId || quarterId.length !== 4) return false;
    const month = parseInt(quarterId.substring(0, 2));
    const year = parseInt(quarterId.substring(2, 4));
    return month >= 1 && month <= 12 && year >= 20 && year <= 99;
  }

  private handleError(message: string): void {
    console.error(message);
    // You can implement more robust error handling here
  }
}
