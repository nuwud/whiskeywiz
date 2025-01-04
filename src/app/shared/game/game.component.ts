import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { Observable } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

interface SampleGuess {
  age: number;
  proof: number;
  mashbill: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class GameComponent {
  @Input() quarterId: string = '';
  @Output() gameComplete = new EventEmitter<number>();

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

  constructor(
    private authService: AuthService,
    private gameService: GameService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.initializeGame();
  }

  private initializeGame(): void {
    this.guesses = {
      'sampleA': { age: 0, proof: 0, mashbill: '' },
      'sampleB': { age: 0, proof: 0, mashbill: '' },
      'sampleC': { age: 0, proof: 0, mashbill: '' },
      'sampleD': { age: 0, proof: 0, mashbill: '' }
    };
  }

  getQuarterTitle(): string {
    return `Quarter ${this.quarterId}`;
  }

  selectSample(index: number): void {
    this.currentSample = index;
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
  }

  showSubmitAllButton(): boolean {
    return Object.values(this.guesses).every(guess => 
      guess.age > 0 && guess.proof > 0 && guess.mashbill !== '');
  }

  async submitGuesses(): Promise<void> {
    const score = await this.gameService.calculateScore(this.guesses);
    this.scores = score.sampleScores;
    this.totalScore = score.totalScore;
    this.gameCompleted = true;
    this.showResults = true;
    this.gameComplete.emit(this.totalScore);
  }

  submitScore(): void {
    this.gameService.submitScore(this.quarterId, this.totalScore);
  }

  share(): void {
    // Implement share functionality
  }

  playAgain(): void {
    this.initializeGame();
    this.gameCompleted = false;
    this.showResults = false;
  }

  handleAuth(): void {
    if (this.isGuest) {
      this.authService.login();
    } else {
      this.authService.logout();
    }
  }

  login(): void {
    this.authService.login();
  }

  getImagePath(filename: string): string {
    return `assets/images/${filename}`;
  }
}