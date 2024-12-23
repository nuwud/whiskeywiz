import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Quarter, PlayerScore } from '../../shared/models/quarter.model';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { firstValueFrom, Observable } from 'rxjs';

// Type definitions
type Mashbill = 'Bourbon' | 'Rye' | 'Wheat' | 'Single Malt' | 'Specialty';

// Game guess interface
interface Guess {
  age: number;
  proof: number;
  mashbill: Mashbill | string;
  rating?: number;
}

interface GuessUpdate {
  age?: number;
  proof?: number;
  mashbill?: Mashbill | string;
  rating?: number;
}

// Button state interface
interface ButtonState {
  isHovered: boolean;
  isPressed: boolean;
  isDisabled?: boolean;
}

// Sample state interface
interface SampleState {
  active: boolean;
  hover: boolean;
  completed: boolean;
}

interface Sample {
  age: number;
  proof: number;
  mashbill: string;
  rating?: number;
}

// Game component
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
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})

// Game component class
export class GameComponent implements OnInit {  // Input handling for quarter ID
  @Input() set quarterId(value: string) {
    if (value) {
      this._quarterId = value;
      this.loadQuarterData();
    }
  }
  // Getter for quarter ID
  get quarterId(): string {
    return this._quarterId;
  }

  // Private properties
  private readonly BASE_IMAGE_PATH = 'assets/images/';
  private _quarterId: string = '';
  private readonly ANIMATION_DELAY = 200;
  private readonly DEBUG_PATHS = !environment.production;
  private navigationInProgress = false;
  private _starRatings: { [key: string]: number } = {
    'sample1': 0,
    'sample2': 0,
    'sample3': 0,
    'sample4': 0
  };

  // Public properties
  playerId: string = '';
  isLoggedIn$: Observable<boolean>;
  isGuest: boolean = true;
  quarterData: Quarter | null = null;
  currentSample: number = 1;
  playerName: string = '';
  guesses: { [key: string]: Guess } = {};
  scores: { [key: string]: number } = {};
  totalScore: number = 0;
  showResults = false;
  gameCompleted: boolean = false;
  scoreSubmitted: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  // Game constructor
  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private gameService: GameService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isAuthenticated();
    // Initialize auth state
    this.authService.getPlayerId().subscribe(id => {
      this.playerId = id;
      this.isGuest = id.startsWith('guest_');
      if (!this.isGuest) {
        this.playerName = localStorage.getItem('playerName') || 'Anonymous';
      }
    });
  }

  // Button and sample states
  buttonStates: { [key: string]: ButtonState } = {
    previous: { isHovered: false, isPressed: false, isDisabled: true },
    next: { isHovered: false, isPressed: false, isDisabled: false },
    submit: { isHovered: false, isPressed: false, isDisabled: false }
  };

  // Sample states
  sampleStates: { [key: number]: SampleState } = {
    1: { active: true, hover: false, completed: false },
    2: { active: false, hover: false, completed: false },
    3: { active: false, hover: false, completed: false },
    4: { active: false, hover: false, completed: false }
  };

  // Game options
  mashbillCategories: Mashbill[] = ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Specialty'];
  mashbillTypes = ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Specialty'];

  private getStorageKey(): string {
    return `gameState_${this._quarterId}`;
  }
  
  // Update how we store game state
  private saveGameState() {
    const gameState = {
      completed: this.gameCompleted,
      scores: this.scores,
      totalScore: this.totalScore,
      quarterData: this.quarterData,
      guesses: this.guesses,
      showResults: this.showResults
    };
    localStorage.setItem(this.getStorageKey(), JSON.stringify(gameState));
  }

  // Lifecycle
  ngOnInit() {
    // First check for stored game state for this specific quarter
    this.route.queryParams.subscribe(params => {
      const quarterId = params['quarter'];
      if (quarterId) {
        this._quarterId = quarterId;
        const savedState = localStorage.getItem(this.getStorageKey());
        
        if (savedState) {
          try {
            const gameState = JSON.parse(savedState);
            if (gameState.completed) {
              this.scores = gameState.scores;
              this.totalScore = gameState.totalScore;
              this.quarterData = gameState.quarterData;
              this.guesses = gameState.guesses;
              this.gameCompleted = true;
              this.showResults = true;
              this.changeDetectorRef.detectChanges();
              return; // Don't continue with normal game initialization
            }
          } catch (e) {
            console.error('Error restoring game state:', e);
          }
        }
        
        // Initialize new game for this quarter
        this.initializeRatings();
        this.loadQuarterData();
      }
    });
  
    this.checkAuthentication();
    this.initializeGuesses();
  }

  checkAuthentication(): void {
    this.authService.isAuthenticated().subscribe(isAuth => {
      console.log('Is authenticated:', isAuth);
    });
  }

  async login() {
    try {
      // First try to get the provider ID if they were a guest
      const currentGuestId = localStorage.getItem('guestId');
      const returnUrl = `/game?quarter=${this._quarterId}`;

      // Store current game state if needed
      if (this.gameCompleted) {
        localStorage.setItem('gameState', JSON.stringify({
          completed: true,
          scores: this.scores,
          totalScore: this.totalScore
        }));
      }

      // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa to login page with return URL
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: `/game?quarter=${this._quarterId}`,
          guestId: currentGuestId // Pass guest ID to potentially merge scores
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      this.error = 'Failed to start login process';
    }
  }

  async continueAsGuest() {
    try {
      // Create guest session via auth service
      const guestId = await firstValueFrom(this.authService.createGuestSession());

      // Set guest state
      this.isGuest = true;
      this.playerId = guestId;

      // Initialize game state for guest
      this.initializeGuesses();

      // Force change detection
      this.changeDetectorRef.detectChanges();

    } catch (error) {
      console.error('Error continuing as guest:', error);
      this.error = 'Failed to continue as guest';
    }
  }

  // Helper method for image paths
  getImagePath(filename: string): string {
    const fullPath = `${this.BASE_IMAGE_PATH}${filename}`;
    if (this.DEBUG_PATHS) {
      console.log(`Loading image: ${fullPath}`);
    }
    return fullPath;
  }

  // Sample navigation
  // Method for directional navigation (Previous/Next buttons)
  changeSampleDirection(direction: number) {
    const newSample = this.currentSample + direction;
    if (newSample >= 1 && newSample <= 4) {

      // Animate sample transition
      this.sampleStates[this.currentSample].active = false;

      setTimeout(() => {
        this.currentSample = newSample;
        this.sampleStates[newSample].active = true;

        // Update completion status
        this.updateSampleCompletion();
        this.changeDetectorRef.detectChanges();
      }, this.ANIMATION_DELAY);
    }
  }

  // Simplified direct sample selection
  selectSample(num: number): void {
    if (num === this.currentSample) return;
    if (num < 1 || num > 4) return;

    this.sampleStates[this.currentSample].active = false;
    this.currentSample = num;
    this.sampleStates[num].active = true;

    this.updateSampleCompletion();
    this.changeDetectorRef.detectChanges();
  }

  // Button image helper
  getButtonImage(type: string): string {
    // Ensure image path is valid
    const imagePath = `assets/images/${type}.png`;
    console.log(`Loading button image: ${imagePath}`);
    return imagePath;
  }

  // Sample indicator image helper
  getSampleIndicatorImage(num: number): string {
    const letter = this.getSampleLetter(num);
    const isActive = this.currentSample === num;
    const filename = `Sample_${letter}${isActive ? '_hover' : ''}.png`;
    return this.getImagePath(filename);
  }

  // Sample management
  getSampleLetter(num: number): string {
    return String.fromCharCode(64 + num); // Converts 1 to A, 2 to B, etc.
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

  // Button press handling
  buttonPress(buttonId: string, isPressed: boolean): void {
    if (this.buttonStates[buttonId] && !this.buttonStates[buttonId].isDisabled) {
      this.buttonStates[buttonId].isPressed = isPressed;
    }
  }

  // Button click handling
  getButtonState(buttonId: string): string {
    const state = this.buttonStates[buttonId];
    if (state.isDisabled) return 'disabled';
    if (state.isPressed) return 'pressed';
    if (state.isHovered) return 'hovered';
    return 'normal';
  }

  // Sample state management
  getSampleState(sampleNum: number): string {
    const state = this.sampleStates[sampleNum];
    if (state.active) return 'active';
    if (state.hover) return 'hover';
    if (state.completed) return 'completed';
    return 'normal';
  }

  // Add safe navigation for guesses
  getGuessValue(sampleNum: number, property: keyof Guess): any {
    const sampleKey = `sample${sampleNum}`;
    if (!this.guesses[sampleKey]) {
      this.guesses[sampleKey] = {
        age: 5,
        proof: 100,
        mashbill: '',
        rating: 0
      };
    }
    return this.guesses[sampleKey][property] ??
      (property === 'age' ? 5 :
        property === 'proof' ? 100 :
          property === 'rating' ? 0 : null);
  }

  get starRatings(): { [key: string]: number } {
    console.log('Getting star ratings:', this._starRatings);
    return this._starRatings;
  }

  // Star rating management
  updateStarRating(sampleNum: number, rating: number) {
    console.log('Updating rating:', { sampleNum, rating }); // Debug log

    // Ensure rating is within 1-10 range
    const sampleKey = `sample${sampleNum}`;
    // Ensure star ratings object exists
    this.starRatings[sampleKey] = rating;

    // Ensure guesses object exists
    if (!this.guesses[sampleKey]) {
      console.log('Creating new guess for:', sampleKey);
      this.guesses[sampleKey] = {
        age: 5,
        proof: 100,
        mashbill: '',
        rating: 0
      };
    } else {
      console.log('Updating existing guess for:', sampleKey);
      this.guesses[sampleKey].rating = rating; // Update rating in guesses
    }

    // Log the updated rating
    console.log('Updated state:', {
      starRatings: this._starRatings,
      guesses: this.guesses,
      currentGuess: this.guesses[sampleKey]
    }); // Debug log

    // Force change detection
    this.changeDetectorRef.detectChanges(); // Update view
    // Update sample completion status
    this.updateSampleCompletion();
  }

  // Star rating SVG generation
  private getSvgStar(filled: boolean): string {
    const fillColor = filled ? '#FFD700' : 'none';
    const strokeColor = '#FFD700';

    return `
      <svg xmlns="http://www.w3.org/2000/svg" 
           viewBox="0 0 24 24" 
           width="24" 
           height="24" 
           fill="${fillColor}" 
           stroke="${strokeColor}" 
           stroke-width="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    `;
  }

  // Sample data retrieval
  getSampleData(sampleNum: number): any {
    const sampleKey = `sample${sampleNum}`;
    if (!this.guesses[sampleKey]) {
      return {
        age: 5,
        proof: 100,
        mashbill: null,
        rating: 0
      };
    }
    return this.guesses[sampleKey];
  }

  // Sample hover management
  onSampleHover(sampleNum: number, isHovered: boolean): void {
    this.sampleStates[sampleNum].hover = isHovered;
  }

  // Sample completion management
  updateSampleCompletion(): void {
    const currentGuess = this.guesses[`sample${this.currentSample}`];
    if (currentGuess &&
      currentGuess.mashbill &&
      currentGuess.age > 0 &&
      currentGuess.proof > 0) {
      this.sampleStates[this.currentSample].completed = true;
    }
  }

  // Firebase interactions
  loadQuarterData() {
    if (!this._quarterId) return;

    // Reset game state
    this.loading = true;
    this.error = null;

    // Load quarter data
    this.firebaseService.getQuarterById(this._quarterId).subscribe({
      next: quarter => {
        if (quarter) {
          this.quarterData = quarter;
          // Force quarter title update
          this.changeDetectorRef.detectChanges();
        } else {
          this.error = 'Quarter not found';
        }
        this.loading = false;
      },
      error: error => {
        console.error('Error loading quarter:', error);
        this.error = 'Failed to load quarter data';
        this.loading = false;
      }
  });
  }

  // Quarter data validation
  private isValidQuarter(quarter: any): quarter is Quarter {
    return quarter
      && typeof quarter === 'object'
      && 'id' in quarter
      && 'name' in quarter
      && 'samples' in quarter;
  }

  // Star rating initialization
  private initializeRatings() {
    for (let i = 1; i <= 4; i++) {
      const sampleKey = `sample${i}`;
      this._starRatings[sampleKey] = 0;
      if (this.guesses[sampleKey]) {
        this.guesses[sampleKey].rating = 0;
      }
    }
    console.log('Ratings initialized:', this._starRatings);
  }

  // Game state management
  initializeGuesses() {
    this.guesses = {};
    this._starRatings = {}; // Reset star ratings

    for (let i = 1; i <= 4; i++) {
      const sampleKey = `sample${i}`;
      this.guesses[sampleKey] = {
        age: 5,
        proof: 100,
        mashbill: '',
        rating: 0
      };
      this.scores[sampleKey] = 0;
      this.starRatings[sampleKey] = 0;
    }

    this.changeDetectorRef.detectChanges();
    console.log('Guesses and Ratings initialized:', {
      guesses: this.guesses,
      ratings: this.starRatings
    }); // Debug log
  }

  // Guess update methods
  updateGuess(sampleNum: number, field: keyof Guess, value: any) {
    const sampleKey = `sample${sampleNum}`;
    if (!this.guesses[sampleKey]) {
      this.guesses[sampleKey] = {
        age: 5,
        proof: 100,
        mashbill: '',
        rating: 0
      };
    }
    (this.guesses[sampleKey][field] as any) = value;
    this.updateSampleCompletion();

  }

  // Validation and submission
  areAllGuessesFilled(): boolean {
    for (let i = 1; i <= 4; i++) {
      const guess = this.guesses[`sample${i}`];
      if (!guess ||
        !guess.mashbill ||
        guess.age <= 0 ||
        guess.proof <= 0) {
        return false;
      }
    }
    return true;
  }

  // Guess submission
  // Submit guesses
  submitGuesses() {
    if (!this.areAllGuessesFilled()) {
      this.error = 'Please complete all guesses';
      return;
    }

    try {
      // Calculate scores
      this.calculateScores();

      // Update game state
      this.gameCompleted = true;
      this.showResults = true;

      this.submitScore();

      // Force view update
      this.changeDetectorRef.detectChanges();

      console.log('Game completed:', {
        scores: this.scores,
        totalScore: this.totalScore,
        showResults: this.showResults,
        gameCompleted: this.gameCompleted
      });
    } catch (error) {
      console.error('Error submitting guesses:', error);
      this.error = 'An error occurred while submitting guesses';
      this.showResults = false;
      this.gameCompleted = false;
    }
  }

  submitScore() {
    // Check for quarter ID
    if (!this._quarterId) {
      this.error = 'Quarter ID is missing';
      return;
    }

    // Store quarter-specific game state
    this.saveGameState();
  
    // Store quarter ID before submission
    localStorage.setItem('lastPlayedQuarter', this._quarterId);

    // Ensure we have a player name
    this.playerName = this.playerName ||
      (this.isGuest ? 'Guest Player' : 'Anonymous');

    // Prepare player score object
    const playerScore: PlayerScore = {
      playerId: this.playerId,
      playerName: this.isGuest ? 'Guest Player' : (localStorage.getItem('playerName') || 'Anonymous'),
      score: this.totalScore,
      quarterId: this._quarterId,
      isGuest: this.isGuest,
      timestamp: new Date()
    };

    console.log('Submitting score:', playerScore); // Debug log

    // Store game state before submitting score
    const gameState = {
      completed: true,
      scores: this.scores,
      totalScore: this.totalScore,
      quarterData: this.quarterData,
      guesses: this.guesses,
      showResults: true
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));

    console.log('Game state saved:', gameState); // Debug log

    // Submit score to Firebase
    this.firebaseService.submitScore(playerScore).subscribe({
      next: () => {
        console.log('Score submitted successfully');
        this.scoreSubmitted = true;
        this.showResults = true; // Show results instead of navigating
        this.error = null;

        // Show registration prompt for guests
        //if (this.isGuest) {
        //  this.showRegisterPrompt();
        //}

      },
      error: (error) => {
        console.error('Error submitting score:', error);
        this.error = 'Failed to submit score';
      }
    });
  }

  navigateToLeaderboard() {
    // Don't check auth status, just navigate directly
    this.router.navigate(['/leaderboard'], {
      queryParams: { quarter: this._quarterId } 
    });
  }

  // Score calculation - moved to separate method
  private calculateScores(): void {
    this.totalScore = 0;

    for (let i = 1; i <= 4; i++) {
      const sampleKey = `sample${i}`;
      const actualSample = this.quarterData?.samples[sampleKey];
      const guess = this.guesses[sampleKey];

      console.log(`Calculating score for ${sampleKey}:`, {
        actual: actualSample,
        guess: guess,
        isMobile: window.innerWidth < 768
      });

      if (!actualSample || !guess?.mashbill) continue;

      let score = 0;

      // Age scoring
      const ageDiff = Math.abs(actualSample.age - (guess.age || 0));
      score += ageDiff === 0 ? 30 : Math.max(0, 20 - (ageDiff * 4));

      // Proof scoring
      const proofDiff = Math.abs(actualSample.proof - (guess.proof || 0));
      if (proofDiff === 0) {
        score += 30; // Perfect match bonus
      } else {
        score += Math.max(0, 20 - (proofDiff * 2)); // 2 points per proof point off
      }

      // Mashbill scoring
      if (guess.mashbill === actualSample.mashbill) score += 10;

      console.log(`Sample ${sampleKey} scoring:`, {
        actual: actualSample,
        guess: guess,
        ageDiff,
        proofDiff,
        mashbillMatch: guess.mashbill === actualSample.mashbill,
        score
      });

      // Store score
      this.scores[sampleKey] = score;
      this.totalScore += score;
    }

    console.log('Final scores:', {
      sampleScores: this.scores,
      totalScore: this.totalScore
    });

  }

  // UI state management
  // Submit button visibility
  showSubmitAllButton(): boolean {
    const allGuessesFilled = this.areAllGuessesFilled();
    const isLastSample = this.currentSample === 4;

    console.log('Submit button check:', {
      allGuessesFilled,
      isLastSample,
      currentSample: this.currentSample
    });

    return isLastSample && allGuessesFilled; // Show on last sample
  }

  // UI feedback and prompts
  private showRegisterPrompt() {
    // Implementation for showing registration prompt
    // Could be a modal or a simple message
  }

  // Game reset
  playAgain() {
    // Remove quarter-specific game state
    localStorage.removeItem(this.getStorageKey());

    // First reset all state
    this.currentSample = 1;
    this.totalScore = 0;
    this.gameCompleted = false;
    this.scoreSubmitted = false;
    this.error = null;
    this.showResults = false;
    
    // Reset all guesses and ratings
    this.initializeGuesses();
    this.initializeRatings();
    
    // Reset sample states
    Object.keys(this.sampleStates).forEach(key => {
      const sampleNum = parseInt(key);
      this.sampleStates[sampleNum] = {
        active: sampleNum === 1,
        hover: false,
        completed: false
      };
    });
  
    // Re-load quarter data
    this.loadQuarterData();
    
    // Force change detection
    this.changeDetectorRef.detectChanges();
  }
  

  // Sharing functionality
  async share() {
    const shareData = {
      title: 'Whiskey Wiz Challenge',
      text: this.getShareText(),
      url: `https://whiskeywiz2.web.app/game?quarter=${this._quarterId}`
    };

    // Check for native share support
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

  async handleAuth() {
    if (this.isGuest) {
      await this.login();
    } else {
      await this.logout();
      // After logout, navigate to login page
      this.router.navigate(['/login']);
    }
  }

  // Share text generation
  private getShareText(): string {
    const ratings = Object.values(this.starRatings).filter(r => r > 0);
    const avgRating = ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 0;

    const quip = this.getScoreQuip();
    let text = `🥃 I scored ${this.totalScore} points in Whiskey Wiz!\n${quip}`;

    // Only add rating if they rated at least one whiskey
    if (ratings.length > 0) {
      text += `\nAverage Rating: ${avgRating}⭐`;
    }

    text += `\nCan you beat my score? #WhiskeyWiz`;
    return text;
  }

  // Score quip generation
  private getScoreQuip(): string {
    if (this.totalScore >= 240) return "🌟 Master Distiller Status!";
    if (this.totalScore >= 200) return "🥃 Whiskey Connoisseur!";
    if (this.totalScore >= 160) return "👍 Solid Palate!";
    if (this.totalScore >= 120) return "🎯 Good Start!";
    return "🌱 Keep Tasting!";
  }

  // Fallback share method
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

      // Sign out and navigate to login
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

  // Button transition states
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

  // Button aria labels
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

  getQuarterTitle(): string {
      // First try to get from quarter data
  if (this.quarterData?.name) {
    return this.quarterData.name;
  }
  
    if (!this.quarterData?.name) {
      // Parse from quarterId if name not available
      try {
        const month = parseInt(this._quarterId.substring(0, 2));
        const year = '20' + this._quarterId.substring(2, 4);

        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        if (month >= 1 && month <= 12) {
          return `${monthNames[month - 1]} ${year}`;
        }
      } catch (e) {
        console.error('Error parsing quarter ID:', e);
      }
    }
    
    return 'Whiskey Wiz Challenge';
  }

  // Star rating helper methods
  getSafeStarHtml(filled: boolean): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getSvgStar(filled));
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

    // Verify each image
    requiredImages.forEach(img => {
      const path = this.getImagePath(img);
      this.verifyImageExists(path);
    });
  }

  // Image verification helper
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