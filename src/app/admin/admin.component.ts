import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Quarter, ScoringRules } from '../shared/models/quarter.model';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  quarters: Quarter[] = [];
  selectedQuarter: Quarter | null = null;
  scoringRules: ScoringRules = {
    agePerfectScore: 30,
    ageBonus: 10,
    agePenaltyPerYear: 5,
    proofPerfectScore: 30,
    proofBonus: 10,
    proofPenaltyPerPoint: 2,
    mashbillCorrectScore: 10
  };
  error: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadQuarters();
    this.loadScoringRules();
    this.subscribeToErrors();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private subscribeToErrors() {
    this.subscriptions.push(
      this.firebaseService.errors$.subscribe(error => {
        this.error = error;
      })
    );
  }

  private loadQuarters() {
    this.subscriptions.push(
      this.firebaseService.getQuarters().subscribe({
        next: (quarters) => this.quarters = quarters,
        error: (error) => {
          console.error('Error loading quarters:', error);
          this.error = 'Failed to load quarters';
        }
      })
    );
  }

  private loadScoringRules() {
    this.subscriptions.push(
      this.firebaseService.getScoringRules().subscribe({
        next: (rules) => {
          if (rules) {
            this.scoringRules = rules;
          }
        },
        error: (error) => {
          console.error('Error loading scoring rules:', error);
          this.error = 'Failed to load scoring rules';
        }
      })
    );
  }

  selectQuarter(quarter: Quarter) {
    this.selectedQuarter = { ...quarter };
    // Initialize samples if they don't exist
    if (!this.selectedQuarter.samples) {
      this.selectedQuarter.samples = {
        sample1: { age: 0, proof: 0, mashbill: 'Bourbon' },
        sample2: { age: 0, proof: 0, mashbill: 'Bourbon' },
        sample3: { age: 0, proof: 0, mashbill: 'Bourbon' },
        sample4: { age: 0, proof: 0, mashbill: 'Bourbon' }
      };
    }
  }

  async saveQuarter() {
    if (!this.selectedQuarter) return;

    try {
      const quarter = await firstValueFrom(this.firebaseService.getQuarterById(this.selectedQuarter.id));
      if (quarter) {
        this.subscriptions.push(
          this.firebaseService.updateQuarter(this.selectedQuarter.id, this.selectedQuarter).subscribe({
            next: () => {
              this.loadQuarters();
              this.error = null;
            },
            error: (error) => {
              console.error('Error saving quarter:', error);
              this.error = 'Failed to save quarter';
            }
          })
        );
      }
    } catch (error) {
      console.error('Error checking quarter:', error);
      this.error = 'Failed to verify quarter';
    }
  }

  async saveScoringRules() {
    try {
      await firstValueFrom(this.firebaseService.updateScoringRules(this.scoringRules));
      this.error = null;
    } catch (error) {
      console.error('Error saving scoring rules:', error);
      this.error = 'Failed to save scoring rules';
    }
  }

  navigateToQuarter(id: string) {
    if (id) {
      this.router.navigate(['/game'], { queryParams: { quarter: id } });
    }
  }

  clearError() {
    this.error = null;
  }
}
