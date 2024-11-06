import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Quarter, PlayerScore } from '../../shared/models/quarter.model';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { environment } from '../../../environments/environment';

// Type definitions
type Mashbill = 'Bourbon' | 'Rye' | 'Wheat' | 'Single Malt' | 'Specialty';

interface Guess {
  age: number;
  proof: number;
  mashbill: Mashbill | null;
}

interface ButtonState {
  isHovered: boolean;
  isPressed: boolean;
  isDisabled?: boolean;
}

interface SampleState {
  active: boolean;
  hover: boolean;
  completed: boolean;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [
    // Button hover animation
    trigger('buttonHover', [
      state('normal', style({
        transform: 'scale(1)',
        filter: 'brightness(1)'
      })),
      state('hovered', style({
        transform: 'scale(1.1)',
        filter: 'brightness(1.2)'
      })),
      state('pressed', style({
        transform: 'scale(0.95)',
        filter: 'brightness(1)'
      })),
      state('disabled', style({
        opacity: '0.5',
        transform: 'scale(1)',
        filter: 'brightness(0.8)'
      })),
      transition('* => hovered', animate('200ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('hovered => normal', animate('150ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('* => pressed', animate('100ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('pressed => *', animate('150ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    // Sample transition animation
    trigger('sampleTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    // Panel fade animation
    trigger('panelFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 0.2 }))
      ])
    ])
  ]
})
export class GameComponent implements OnInit {
  // Input handling for quarter ID
  @Input() set quarterId(value: string) {
    if (value) {
      this._quarterId = value;
      this.loadQuarterData();
    }
  }
  get quarterId(): string {
    return this._quarterId;
  }

  // Private properties
  private readonly BASE_IMAGE_PATH = 'assets/images/';
  private _quarterId: string = '';
  private readonly ANIMATION_DELAY = 200;
  private readonly DEBUG_PATHS = !environment.production;

  // Public properties
  isLoggedIn: boolean = false;
  playerId: string = '';
  isGuest: boolean = true;
  quarterData: Quarter | null = null;
  currentSample: number = 1;
  playerName: string = '';
  guesses: { [key: string]: Guess } = {};
  scores: { [key: string]: number } = {};
  totalScore: number = 0;
  gameCompleted: boolean = false;
  scoreSubmitted: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  // Button and sample states
  buttonStates: { [key: string]: ButtonState } = {
    previous: { isHovered: false, isPressed: false, isDisabled: true },
    next: { isHovered: false, isPressed: false, isDisabled: false },
    submit: { isHovered: false, isPressed: false, isDisabled: false }
  };

  sampleStates: { [key: number]: SampleState } = {
    1: { active: true, hover: false, completed: false },
    2: { active: false, hover: false, completed: false },
    3: { active: false, hover: false, completed: false },
    4: { active: false, hover: false, completed: false }
  };

  // Game options
  mashbillCategories: Mashbill[] = ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Specialty'];
  mashbillTypes = ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Specialty'];

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private gameService: GameService,
    private authService: AuthService
  ) {
    // Initialize auth state
    this.authService.getPlayerId().subscribe(id => {
      this.playerId = id;
      this.isGuest = id.startsWith('guest_');
    });
  }

    // Helper method for image paths
    getImagePath(filename: string): string {
      const fullPath = `${this.BASE_IMAGE_PATH}${filename}`;
      if (this.DEBUG_PATHS) {
        console.log(`Loading image: ${fullPath}`);
      }
      return fullPath;
    }
  
    // Helper for button images
    getButtonImage(type: string, state: string = ''): string {
      const filename = `${type}${state}.png`;
      const path = this.getImagePath(filename);
      if (this.DEBUG_PATHS) {
        console.log(`Button image request - Type: ${type}, State: ${state}, Path: ${path}`);
      }
      return path;
    }
  
    // Sample indicator image helper
    getSampleIndicatorImage(num: number): string {
      const letter = this.getSampleLetter(num);
      const isActive = this.currentSample === num;
      const filename = `Sample_${letter}${isActive ? '_hover' : ''}.png`;
      return this.getImagePath(filename);
    }

  ngOnInit() {
    // Handle route parameters for direct navigation
    this.route.queryParams.subscribe(params => {
      const quarterId = params['quarter'];
      if (quarterId) {
        this.quarterId = quarterId;
      }
    });
  }

  // Button state management
  buttonHover(buttonId: string, isHovered: boolean): void {
    if (this.buttonStates[buttonId]) {
      this.buttonStates[buttonId].isHovered = isHovered;
      if (isHovered) {
        this.buttonStates[buttonId].isPressed = false;
      }
    }
  }

  buttonPress(buttonId: string, isPressed: boolean): void {
    if (this.buttonStates[buttonId] && !this.buttonStates[buttonId].isDisabled) {
      this.buttonStates[buttonId].isPressed = isPressed;
    }
  }

  getButtonState(buttonId: string): string {
    const state = this.buttonStates[buttonId];
    if (state.isDisabled) return 'disabled';
    if (state.isPressed) return 'pressed';
    if (state.isHovered) return 'hovered';
    return 'normal';
  }

  // Sample management
  getSampleLetter(num: number): string {
    return String.fromCharCode(64 + num); // Converts 1 to A, 2 to B, etc.
  }

  changeSample(direction: number) {
    const newSample = this.currentSample + direction;
    if (newSample >= 1 && newSample <= 4) {
      // Update button states
      this.buttonStates.previous.isDisabled = newSample === 1;
      this.buttonStates.next.isDisabled = newSample === 4;

      // Animate sample transition
      this.sampleStates[this.currentSample].active = false;
      
      setTimeout(() => {
        this.currentSample = newSample;
        this.sampleStates[newSample].active = true;
        
        // Update completion status
        this.updateSampleCompletion();
      }, this.ANIMATION_DELAY);
    }
  }

  // Sample state management
  getSampleState(sampleNum: number): string {
    const state = this.sampleStates[sampleNum];
    if (state.active) return 'active';
    if (state.hover) return 'hover';
    if (state.completed) return 'completed';
    return 'normal';
  }

  onSampleHover(sampleNum: number, isHovered: boolean): void {
    this.sampleStates[sampleNum].hover = isHovered;
  }

  updateSampleCompletion(): void {
    const currentGuess = this.guesses[`sample${this.currentSample}`];
    if (currentGuess && currentGuess.mashbill && currentGuess.age > 0 && currentGuess.proof > 0) {
      this.sampleStates[this.currentSample].completed = true;
    }
  }

  // Firebase interactions
  loadQuarterData() {
    if (!this._quarterId) return;

    this.loading = true;
    this.error = null;

    this.firebaseService.getQuarterById(this._quarterId).subscribe(
      quarter => {
        if (quarter) {
          this.quarterData = quarter;
          this.initializeGuesses();
        } else {
          this.error = 'Quarter not found';
        }
        this.loading = false;
      },
      error => {
        console.error('Error loading quarter:', error);
        this.error = 'Failed to load quarter data';
        this.loading = false;
      }
    );
  }

  private isValidQuarter(quarter: any): quarter is Quarter {
    return quarter 
      && typeof quarter === 'object'
      && 'id' in quarter
      && 'name' in quarter
      && 'samples' in quarter;
  }

  // Game state management
  initializeGuesses() {
    for (let i = 1; i <= 4; i++) {
      this.guesses[`sample${i}`] = {
        age: 5,
        proof: 100,
        mashbill: null
      };
      this.scores[`sample${i}`] = 0;
    }
  }

  updateGuess(sampleNum: number, field: keyof Guess, value: any) {
    if (!this.guesses[`sample${sampleNum}`]) {
      this.guesses[`sample${sampleNum}`] = { age: 5, proof: 100, mashbill: null };
    }
    (this.guesses[`sample${sampleNum}`][field] as any) = value;
    this.updateSampleCompletion();
  }

  areAllGuessesFilled(): boolean {
    for (let i = 1; i <= 4; i++) {
      const guess = this.guesses[`sample${i}`];
      if (!guess || !guess.mashbill || guess.age <= 0 || guess.proof <= 0) {
        return false;
      }
    }
    return true;
  }

  // Score calculation and submission
  submitGuesses() {
    if (!this.areAllGuessesFilled()) {
      this.error = 'Please fill in all guesses';
      return;
    }

    this.totalScore = 0;
    for (let i = 1; i <= 4; i++) {
      const sampleKey = `sample${i}`;
      const actualSample = this.quarterData?.samples[sampleKey];
      const guess = this.guesses[sampleKey];

      if (!actualSample || !guess.mashbill) continue;

      let score = 0;

      // Age scoring
      const ageDiff = Math.abs(actualSample.age - guess.age);
      if (ageDiff === 0) {
        score += 30; // 20 points + 10 bonus
      } else {
        score += Math.max(0, 20 - (ageDiff * 4));
      }

      // Proof scoring
      const proofDiff = Math.abs(actualSample.proof - guess.proof);
      if (proofDiff === 0) {
        score += 30; // 20 points + 10 bonus
      } else {
        score += Math.max(0, 20 - (proofDiff * 2));
      }

      // Mashbill scoring
      if (guess.mashbill === actualSample.mashbill) {
        score += 10;
      }

      this.scores[sampleKey] = score;
      this.totalScore += score;
    }

    this.gameCompleted = true;
  }

  submitScore() {
    if (!this.playerName) {
      this.error = 'Please enter your name';
      return;
    }

    if (!this._quarterId) {
      this.error = 'Quarter ID is missing';
      return;
    }

    const playerScore: PlayerScore = {
      playerId: this.playerId,
      playerName: this.isGuest ? this.playerName : '',
      score: this.totalScore,
      quarterId: this._quarterId,
      isGuest: this.isGuest
    };

    this.firebaseService.submitScore(playerScore).subscribe(
      () => {
        console.log('Score submitted successfully');
        this.scoreSubmitted = true;
        this.error = null;

        if (this.isGuest) {
          this.showRegisterPrompt();
        }
      },
      error => {
        console.error('Error submitting score:', error);
        this.error = 'Failed to submit score';
      }
    );
  }

  // UI feedback and prompts
  private showRegisterPrompt() {
    // Implementation for showing registration prompt
    // Could be a modal or a simple message
  }

  // Game reset
  playAgain() {
    this.currentSample = 1;
    this.totalScore = 0;
    this.gameCompleted = false;
    this.scoreSubmitted = false;
    this.error = null;
    this.initializeGuesses();
    
    // Reset all sample states
    Object.keys(this.sampleStates).forEach(key => {
      const sampleNum = parseInt(key);
      this.sampleStates[sampleNum] = {
        active: sampleNum === 1,
        hover: false,
        completed: false
      };
    });
  }

  // Sharing functionality
  async share() {
    const shareData = {
      title: 'Whiskey Wiz Challenge',
      text: this.getShareText(),
      url: `https://whiskeywiz2.web.app/game?quarter=${this._quarterId}`
    };
  
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        this.fallbackShare();
      }
    } else {
      this.fallbackShare();
    }
  }
  
  private getShareText(): string {
    const quip = this.getScoreQuip();
    return `🥃 I scored ${this.totalScore} points in Whiskey Wiz!\n${quip}\nCan you beat my score? #WhiskeyWiz`;
  }
  
  private getScoreQuip(): string {
    if (this.totalScore >= 240) return "🌟 Master Distiller Status!";
    if (this.totalScore >= 200) return "🥃 Whiskey Connoisseur!";
    if (this.totalScore >= 160) return "👍 Solid Palate!";
    if (this.totalScore >= 120) return "🎯 Good Start!";
    return "🌱 Keep Tasting!";
  }
  
  private fallbackShare() {
    const text = this.getShareText();
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Results copied to clipboard! Share with your friends!');
      })
      .catch(err => {
        console.error('Failed to copy results:', err);
        alert('Unable to copy results. Please try again.');
      });
  }

  // Auth management
  async logout() {
    try {
      // Fade out animation
      const container = document.querySelector('.game-container');
      if (container) {
        container.classList.add('fade-out');
        await new Promise(resolve => setTimeout(resolve, 300)); // Wait for animation
      }
      
      await this.authService.signOut();
      // Navigation will be handled by auth guard
    } catch (error) {
      console.error('Error logging out:', error);
      this.error = 'Failed to logout';
    }
  }

  // Panel background handling
  getPanelBackground(position: 'left' | 'middle' | 'right'): string {
    return `assets/images/large-panel-${position}.png`;
  }

  // Slider track decoration
  getSliderTrackImage(): string {
    return 'assets/images/Track.png';
  }

  // Radio button images
  getRadioButtonImage(checked: boolean): string {
    return checked ? 'assets/images/Ellipse_B.png' : 'assets/images/Ellipse_W.png';
  }

  // Animation helper methods
  getPanelTransitionState(sampleNum: number): string {
    return this.currentSample === sampleNum ? 'active' : 'inactive';
  }

  getButtonTransitionState(buttonId: string): string {
    const state = this.buttonStates[buttonId];
    if (state.isDisabled) return 'disabled';
    if (state.isPressed) return 'pressed';
    if (state.isHovered) return 'hovered';
    return 'normal';
  }

  // Accessibility helpers
  getSampleAriaLabel(sampleNum: number): string {
    return `Sample ${this.getSampleLetter(sampleNum)}${this.currentSample === sampleNum ? ' (current)' : ''}`;
  }

  getButtonAriaLabel(type: string): string {
    switch (type) {
      case 'previous':
        return `Previous Sample${this.currentSample === 1 ? ' (disabled)' : ''}`;
      case 'next':
        return `Next Sample${this.currentSample === 4 ? ' (disabled)' : ''}`;
      case 'submit':
        return 'Submit All Guesses';
      default:
        return '';
    }
  }

   // Image path verification
   private verifyImagePaths() {
    const requiredImages = [
      'blackbackground.png',
      'BlindBarrels.png',
      'Previous_Sample_Button.png',
      'Next_Sample_Button.png',
      'Track.png',
      'Ellipse_W.png',
      'Ellipse_B.png',
      'Submit_All_Guesses.png',
      'dial_x.png'
    ];

    requiredImages.forEach(img => {
      const path = this.getImagePath(img);
      this.verifyImageExists(path);
    });
  }

  private verifyImageExists(path: string) {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ Image loaded successfully: ${path}`);
    };
    img.onerror = () => {
      console.error(`❌ Failed to load image: ${path}`);
    };
    img.src = path;
  }

    // Error handling helper
    handleError(error: any, context: string) {
      console.error(`Error in ${context}:`, error);
      this.error = `Failed to ${context.toLowerCase()}`;
    }

}