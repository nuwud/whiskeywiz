import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { Quarter, Sample } from '../shared/models/quarter.model';
import { ScoringRules } from '../shared/models/scoring.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  quarters: Quarter[] = [];
  selectedQuarter: Quarter | null = null;
  sampleNumbers = [1, 2, 3, 4];
  error: string | null = null;
  successMessage: string | null = null;
  showingAnalytics: boolean = false;
  private subscriptions = new Subscription();

  scoringRules: ScoringRules = {
    agePerfectScore: 20,
    ageBonus: 10,
    agePenaltyPerYear: 4,
    proofPerfectScore: 20,
    proofBonus: 10,
    proofPenaltyPerPoint: 2,
    mashbillCorrectScore: 10
  };

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check authentication first
    this.subscriptions.add(
      this.authService.isAdmin().subscribe(isAdmin => {
        if (!isAdmin) {
          console.log('Not admin, redirecting');
          this.router.navigate(['/']);
          return;
        }
        this.loadQuarters();
        this.loadScoringRules();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  async loadQuarters() {
    try {
      const quarters = await firstValueFrom(this.firebaseService.getQuarters());
      this.quarters = quarters
        .filter(q => q !== null)
        .sort((a, b) => {
          const parseQuarter = (name: string) => {
            const [q, y] = name.split(' ');
            return {
              year: parseInt(y),
              quarter: parseInt(q.substring(1))
            };
          };
          
          const quarterA = parseQuarter(a.name);
          const quarterB = parseQuarter(b.name);
          
          if (quarterA.year !== quarterB.year) {
            return quarterA.year - quarterB.year;
          }
          return quarterA.quarter - quarterB.quarter;
        });
      this.error = null;
    } catch (error) {
      console.error('Error loading quarters:', error);
      this.error = 'Failed to load quarters. Please try again.';
    }
  }

  async loadScoringRules() {
    try {
      const rules = await firstValueFrom(this.firebaseService.getScoringRules());
      if (rules) {
        this.scoringRules = rules;
      }
    } catch (error) {
      console.error('Error loading scoring rules:', error);
      this.error = 'Failed to load scoring rules.';
    }
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
      this.error = 'Failed to log out.';
    }
  }

  showQuarters() {
    this.showingAnalytics = false;
    this.selectedQuarter = null;
  }

  showAnalytics() {
    this.showingAnalytics = true;
    this.selectedQuarter = null;
  }

  showScoringRules() {
    this.selectedQuarter = null;
    this.showingAnalytics = false;
  }

  copyToClipboard(quarterId: string) {
    const textToCopy = `<whiskey-wiz-${quarterId}></whiskey-wiz-${quarterId}>`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        this.successMessage = 'Copied to clipboard';
        setTimeout(() => this.successMessage = null, 3000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        this.error = 'Failed to copy to clipboard';
      });
  }

  async selectQuarter(quarter: Quarter) {
    this.selectedQuarter = { ...quarter };
    this.error = null;
    this.successMessage = null;
    this.showingAnalytics = false;
  }

  async updateQuarter() {
    if (!this.selectedQuarter?.id) {
      this.error = 'No quarter selected';
      return;
    }

    try {
      const isAdmin = await firstValueFrom(this.authService.isAdmin());
      if (!isAdmin) {
        this.error = 'You do not have permission to update quarters';
        return;
      }

      await firstValueFrom(
        this.firebaseService.updateQuarter(
          this.selectedQuarter.id,
          this.selectedQuarter
        )
      );

      await this.loadQuarters();
      this.successMessage = 'Quarter updated successfully';
      this.error = null;
    } catch (error) {
      console.error('Failed to update quarter:', error);
      this.error = 'Failed to update quarter. Please try again.';
    }
  }

  async updateScoringRules() {
    try {
      const isAdmin = await firstValueFrom(this.authService.isAdmin());
      if (!isAdmin) {
        this.error = 'You do not have permission to update scoring rules';
        return;
      }

      await firstValueFrom(this.firebaseService.updateScoringRules(this.scoringRules));
      this.successMessage = 'Scoring rules updated successfully';
      this.error = null;
    } catch (error) {
      console.error('Error updating scoring rules:', error);
      this.error = 'Failed to update scoring rules';
    }
  }

  navigateToQuarter(quarterId: string) {
    this.router.navigate(['/#/game'], { queryParams: { quarter: quarterId } });
  }

  getSampleKey(num: number): string {
    return `sample${num}`;
  }

  clearError() {
    this.error = null;
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
}
