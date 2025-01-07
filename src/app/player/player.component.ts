import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Quarter, Sample, MashbillType, SampleLetter } from '../shared/models/quarter.model';

interface PlayerGuess {
  mashbill: MashbillType;
  proof: number;
  age: number;
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  quarters$ = new BehaviorSubject<Quarter[]>([]);
  currentQuarter$ = new BehaviorSubject<Quarter | null>(null);
  guesses: Record<SampleLetter, PlayerGuess> = this.initializeGuesses();
  sampleScores: Record<SampleLetter, number> = this.initializeScores();
  totalScore = 0;
  showResults = false;
  private subscriptions: Subscription[] = [];

  readonly sampleLetters: SampleLetter[] = ['A', 'B', 'C', 'D'];
  readonly mashbillTypes: MashbillType[] = [
    'Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Blend', 'Specialty'
  ];
  readonly proofRange = { min: 80, max: 130 };
  readonly ageRange = { min: 1, max: 10 };

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadQuarters();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeGuesses(): Record<SampleLetter, PlayerGuess> {
    return {
      'A': { mashbill: 'Bourbon', proof: 100, age: 5 },
      'B': { mashbill: 'Bourbon', proof: 100, age: 5 },
      'C': { mashbill: 'Bourbon', proof: 100, age: 5 },
      'D': { mashbill: 'Bourbon', proof: 100, age: 5 }
    };
  }

  private initializeScores(): Record<SampleLetter, number> {
    return {
      'A': 0, 'B': 0, 'C': 0, 'D': 0
    };
  }

  private loadQuarters() {
    const quartersSub = this.firebaseService.getAllQuarters()
      .subscribe(quarters => {
        this.quarters$.next(quarters);
      });
    this.subscriptions.push(quartersSub);
  }

  onQuarterSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const quarterId = select.value;
    
    if (quarterId) {
      this.firebaseService.getQuarterById(quarterId)
        .pipe(take(1))
        .subscribe(quarter => {
          if (quarter) {
            this.currentQuarter$.next(quarter);
            this.resetGuesses();
            this.showResults = false;
          }
        });
    } else {
      this.currentQuarter$.next(null);
      this.resetGuesses();
    }
  }

  private resetGuesses() {
    this.guesses = this.initializeGuesses();
    this.sampleScores = this.initializeScores();
    this.totalScore = 0;
  }

  submitAnswers() {
    const quarter = this.currentQuarter$.value;
    if (!quarter) return;

    this.sampleLetters.forEach(letter => {
      const guess = this.guesses[letter];
      const sample = this.getSampleFromLetter(quarter, letter);
      if (sample) {
        this.sampleScores[letter] = this.calculateSampleScore(guess, sample);
      }
    });

    this.totalScore = Object.values(this.sampleScores).reduce((a, b) => a + b, 0);
    this.showResults = true;

    // Submit score to Firebase
    this.firebaseService.saveScore(quarter.id, 'player', this.totalScore);
  }

  private getSampleFromLetter(quarter: Quarter, letter: SampleLetter): Sample {
    const sampleMap = {
      'A': quarter.samples.sample1,
      'B': quarter.samples.sample2,
      'C': quarter.samples.sample3,
      'D': quarter.samples.sample4
    };
    return sampleMap[letter];
  }

  private calculateSampleScore(guess: PlayerGuess, actual: Sample): number {
    let score = 0;

    // Mashbill score (10 points)
    if (guess.mashbill === actual.mashbill) score += 10;

    // Proof score (up to 10 points)
    const proofDiff = Math.abs(guess.proof - actual.proof);
    score += Math.max(0, 10 - proofDiff);

    // Age score (up to 10 points)
    const ageDiff = Math.abs(guess.age - actual.age);
    score += Math.max(0, 10 - (ageDiff * 2));

    return score;
  }
}
