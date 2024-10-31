import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Quarter, Sample, ScoringRules } from '../shared/models/quarter.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  quarters: Quarter[] = [];
  selectedQuarter: Quarter | null = null;
  sampleNumbers = [1, 2, 3, 4];
  error: string | null = null;
  successMessage: string | null = null;

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
    this.loadQuarters();
    this.loadScoringRules();
  }

  async loadQuarters() {
    try {
      const quarters = await firstValueFrom(this.firebaseService.getQuarters());
      console.log('Loaded quarters:', quarters);
      this.quarters = quarters
        .filter((q): q is Quarter => {
          return q !== null && 
                 typeof q === 'object' && 
                 'id' in q && 
                 typeof q.name === 'string' && 
                 typeof q.active === 'boolean';
        })
        .sort((a, b) => {
          const matchA = a.id?.match(/Q(\d)(\d{2})(\d{2})/);
          const matchB = b.id?.match(/Q(\d)(\d{2})(\d{2})/);
          if (!matchA || !matchB) return 0;
          const [aYear, aQuarter] = matchA.slice(2);
          const [bYear, bQuarter] = matchB.slice(2);
          return (parseInt(bYear + bQuarter, 10)) - (parseInt(aYear + aQuarter, 10));
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
    }
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // Non-null assertion method for use in template
  getQuarterId(): string {
    if (!this.selectedQuarter?.id) {
      throw new Error('Quarter ID is undefined');
    }
    return this.selectedQuarter.id;
  }
  
  // Safe navigation method for use in component
  navigateToQuarter(quarterId: string | undefined) {
    if (!quarterId) {
      console.error('No quarter ID provided');
      return;
    }
    this.router.navigate(['/game'], { queryParams: { quarter: quarterId }});
  }

  copyToClipboard(quarterId: string | undefined) {
    if (!quarterId) {
      console.error('No quarter ID provided');
      return;
    }
    const textToCopy = `<whiskey-wiz-${quarterId}></whiskey-wiz-${quarterId}>`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => console.log('Copied to clipboard'))
      .catch(err => console.error('Failed to copy:', err));
  }

  async selectQuarter(quarter: Quarter) {
    if (!quarter) return;
    this.selectedQuarter = { ...quarter };
    this.error = null;
    this.successMessage = null;
  }

  showScoringRules() {
    this.selectedQuarter = null;
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
  
      // Simply update the selected quarter without affecting others
      await firstValueFrom(
        this.firebaseService.updateQuarter(
          this.selectedQuarter.id,
          this.selectedQuarter
        )
      );
  
      await this.loadQuarters();
      
      const updatedQuarter = this.quarters.find(q => q.id === this.selectedQuarter?.id);
      if (updatedQuarter) {
        this.selectedQuarter = { ...updatedQuarter };
      }
  
      this.successMessage = 'Quarter updated successfully';
      this.error = null;
    } catch (error) {
      console.error('Failed to update quarter:', error);
      this.error = 'Failed to update quarter. Please try again.';
      this.successMessage = null;
    }
  }

  getSample(num: number): Sample | undefined {
    if (!this.selectedQuarter) return undefined;
    const sampleKey = `sample${num}`;
    return this.selectedQuarter.samples[sampleKey];
  }

  async updateScoringRules() {
    try {
      if (!await firstValueFrom(this.authService.isAdmin())) {
        this.error = 'You do not have permission to update scoring rules';
        return;
      }

      await firstValueFrom(this.firebaseService.updateScoringRules(this.scoringRules));
      this.successMessage = 'Scoring rules updated successfully';
      this.error = null;
    } catch (error) {
      console.error('Error updating scoring rules:', error);
      this.error = 'Failed to update scoring rules. Please try again.';
    }
  }

  clearMessages() {
    this.error = null;
    this.successMessage = null;
  }

  clearError() {
    this.error = null;
  }

  getSampleKey(num: number): string {
    return `sample${num}`;
  }
}