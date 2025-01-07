import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { ValidationService } from '../services/validation.service';
import { Quarter, PlayerScore } from '../shared/models/quarter.model';
import { Subscription, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

interface QuarterPreview {
  id: string;
  formattedName: string;
  completed: boolean;
  highScore?: number;
}

@Component({
  template: `
    <div class="quarters-container">
      <h2 class="font-hermona-2xl text-center mb-8">Available Quarters</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let quarter of quarters" 
            class="quarter-card p-6 rounded-lg shadow-md cursor-pointer"
            [class.completed]="quarter.completed"
            (click)="playQuarter(quarter.id)">
          
          <h3 class="font-hermona-xl mb-4">{{quarter.formattedName}}</h3>
          
          <div *ngIf="quarter.completed" class="completed-info">
            <p class="text-green-600">Completed!</p>
            <p *ngIf="quarter.highScore">High Score: {{quarter.highScore}}</p>
          </div>
          
          <div *ngIf="!quarter.completed" class="play-prompt">
            <p>Ready to Test Your Skills?</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quarter-card {
      background: white;
      border: 1px solid #ddd;
      transition: transform 0.2s;
    }
    .quarter-card:hover {
      transform: translateY(-2px);
    }
    .quarter-card.completed {
      border-color: #10B981;
    }
  `]
})
export class QuartersComponent implements OnInit, OnDestroy {
  quarters: QuarterPreview[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private validationService: ValidationService
  ) {}

  ngOnInit() {
    this.loadQuarters();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadQuarters() {
    const quartersSub = forkJoin({
      quarters: this.firebaseService.getAllQuarters().pipe(take(1)),
      scores: this.firebaseService.getQuarterScores('all').pipe(take(1))
    }).subscribe({
      next: ({ quarters, scores }) => {
        this.processQuarters(quarters, scores);
      },
      error: (error) => {
        console.error('Error loading quarters:', error);
      }
    });

    this.subscriptions.push(quartersSub);
  }

  private processQuarters(quarters: Quarter[], scores: PlayerScore[]): void {
    this.quarters = quarters.map(quarter => ({
      id: quarter.id,
      formattedName: this.formatQuarter(quarter.id),
      completed: scores.some(score => score.quarterId === quarter.id),
      highScore: this.getHighScore(scores, quarter.id)
    })).sort((a, b) => b.id.localeCompare(a.id));  // Sort by newest first
  }

  private formatQuarter(mmyy: string): string {
    const month = parseInt(mmyy.substring(0, 2));
    const year = parseInt(mmyy.substring(2));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[month - 1]} '${year.toString().padStart(2, '0')}`;
  }

  private getHighScore(scores: PlayerScore[], quarterId: string): number {
    return Math.max(
      0,
      ...scores
        .filter(score => score.quarterId === quarterId)
        .map(score => score.score)
    );
  }

  playQuarter(mmyy: string): void {
    this.router.navigate(['/quarters', mmyy]);
  }
}