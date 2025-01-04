import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { BehaviorSubject } from 'rxjs';

interface Sample {
  mashbill: string;
  proof: number;
  age: number;
}

interface Quarter {
  id: string;
  name: string;
  samples: Sample[];
}

@Component({
  selector: 'app-player',
  template: `
    <div class="container mx-auto p-4">
      <select 
        class="mb-4 p-2 border rounded" 
        (change)="onQuarterSelect($event)">
        <option value="">Select Quarter</option>
        <option *ngFor="let quarter of quarters$ | async" [value]="quarter.id">
          {{ quarter.name }}
        </option>
      </select>

      <div *ngIf="currentQuarter$ | async as quarter" class="space-y-4">
        <div *ngFor="let sample of quarter.samples; let i = index" class="p-4 border rounded">
          <div class="mb-4">
            <label class="block mb-2">Sample {{ i + 1 }} - Select Mashbill:</label>
            <select 
              class="p-2 border rounded" 
              [(ngModel)]="guesses[i].mashbill">
              <option *ngFor="let type of mashbillTypes" [value]="type">{{ type }}</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2">Guess Proof: {{ guesses[i].proof }}</label>
            <input 
              type="range" 
              min="80" 
              max="130" 
              [(ngModel)]="guesses[i].proof"
              class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-2">Guess Age: {{ guesses[i].age }}</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              [(ngModel)]="guesses[i].age"
              class="w-full">
          </div>
        </div>

        <button 
          *ngIf="quarter.samples?.length"
          (click)="submitAnswers()"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit Answers
        </button>

        <div *ngIf="showResults" class="mt-4 p-4 border rounded">
          <div *ngFor="let score of sampleScores; let i = index">
            Sample {{ i + 1 }}: {{ score }} points
          </div>
          <div class="mt-2 font-bold">
            Total Score: {{ totalScore }} points
          </div>
        </div>
      </div>
    </div>
  `
})
export class PlayerComponent implements OnInit {
  quarters$ = new BehaviorSubject<Quarter[]>([]);
  currentQuarter$ = new BehaviorSubject<Quarter | null>(null);
  guesses: Sample[] = [];
  sampleScores: number[] = [];
  totalScore = 0;
  showResults = false;

  mashbillTypes = ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Blend', 'Specialty'];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Fetch quarters
    this.firebaseService.getQuarters().subscribe(quarters => {
      this.quarters$.next(quarters);
    });
  }

  onQuarterSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const quarterId = select.value;
    
    if (quarterId) {
      this.firebaseService.getQuarterById(quarterId).subscribe(quarter => {
        if (quarter) {
          this.currentQuarter$.next(quarter);
          this.guesses = quarter.samples.map(() => ({
            mashbill: this.mashbillTypes[0],
            proof: 100,
            age: 5
          }));
          this.showResults = false;
        }
      });
    } else {
      this.currentQuarter$.next(null);
      this.guesses = [];
    }
  }

  submitAnswers() {
    const quarter = this.currentQuarter$.value;
    if (!quarter) return;

    this.sampleScores = this.guesses.map((guess, index) => {
      const actualSample = quarter.samples[index];
      let score = 0;

      if (guess.mashbill === actualSample.mashbill) score += 10;
      score += 10 - Math.abs(guess.proof - actualSample.proof);
      score += 10 - Math.abs(guess.age - actualSample.age);

      return score;
    });

    this.totalScore = this.sampleScores.reduce((a, b) => a + b, 0);
    this.showResults = true;

    // Submit score to Firebase
    this.firebaseService.submitScore({
      quarterId: quarter.id,
      score: this.totalScore,
      timestamp: new Date(),
      guesses: this.guesses
    }).subscribe();
  }
}
