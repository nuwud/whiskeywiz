import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { ValidationService } from '../services/validation.service';

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
export class QuartersComponent implements OnInit {
  quarters: QuarterPreview[] = [];

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private validationService: ValidationService
  ) {}

  async ngOnInit() {
    try {
      const availableQuarters = await this.firebaseService.getQuarters();
      const userScores = await this.firebaseService.getUserScores();
      
      this.quarters = availableQuarters.map(quarter => ({
        id: quarter.id,
        formattedName: this.validationService.formatQuarter(quarter.id),
        completed: userScores?.some(score => score.quarterId === quarter.id) ?? false,
        highScore: userScores
          ?.filter(score => score.quarterId === quarter.id)
          ?.reduce((max, score) => Math.max(max, score.value), 0)
      })).sort((a, b) => b.id.localeCompare(a.id));  // Sort by newest first
      
    } catch (error) {
      console.error('Error loading quarters:', error);
    }
  }

  playQuarter(mmyy: string) {
    this.router.navigate(['/quarters', mmyy]);
  }
}

// FOR_CLAUDE: Quarter selection interface that shows available quarters and user progress