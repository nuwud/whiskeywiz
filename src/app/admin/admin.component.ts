import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Quarter, Sample, ScoringRules, isValidQuarter } from '../shared/models/quarter.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  quarters: Quarter[] = [];
  selectedQuarter: Quarter | null = null;
  sampleNumbers = [1, 2, 3, 4];
  error: string | null = null;
  successMessage: string | null = null;
  isMenuCollapsed = false;

  scoringRules: ScoringRules = {
    agePerfectScore: 20,
    ageBonus: 10,
    agePenaltyPerYear: 4,
    proofPerfectScore: 20,
    proofBonus: 10,
    proofPenaltyPerPoint: 2,
    mashbillCorrectScore: 10
  };

  private resizeListener = () => {
    if (window.innerWidth > 768) {
      this.isMenuCollapsed = false;
    }
  };

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadQuarters();
    this.loadScoringRules();
    
    window.addEventListener('resize', this.resizeListener);
    
    // Subscribe to auth state changes
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (!user) {
          this.router.navigate(['/login']);
        }
      });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu() {
    if (window.innerWidth <= 768) {
      this.isMenuCollapsed = !this.isMenuCollapsed;
    }
  }

  async loadQuarters() {
    try {
      const quarters = await firstValueFrom(this.firebaseService.getQuarters());
      console.log('Loaded quarters:', quarters);
      this.quarters = quarters
        .filter(isValidQuarter)
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
      this.error = 'Failed to load scoring rules. Please try again.';
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

  getQuarterId(): string {
    if (!this.selectedQuarter?.id) {
      throw new Error('Quarter ID is undefined');
    }
    return this.selectedQuarter.id;
  }
  
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
      .then(() => this.successMessage = 'Component tag copied to clipboard')
      .catch(err => {
        console.error('Failed to copy:', err);
        this.error = 'Failed to copy to clipboard';
      });
  }

  async selectQuarter(quarter: Quarter) {
    if (!quarter?.id) {
      this.error = 'Invalid quarter selected';
      return;
    }
    
    try {
      const quarterData = await firstValueFrom(this.firebaseService.getQuarterById(quarter.id));
      if (!quarterData) {
        throw new Error('Quarter not found');
      }
      this.selectedQuarter = { ...quarterData };
      this.error = null;
      this.successMessage = null;
    } catch (error) {
      this.error = `Failed to load quarter details: ${(error as Error).message}`;
      this.selectedQuarter = null;
    }
  }

  showScoringRules() {
    this.selectedQuarter = null;
    this.clearMessages();
  }

  async updateQuarter() {
    if (!this.selectedQuarter?.id) {
      this.error = 'No quarter selected';
      return;
    }

    try {
      const isAdmin = await firstValueFrom(this.authService.isAdmin());
      if (!isAdmin) {
        throw new Error('You do not have permission to update quarters');
      }

      if (!isValidQuarter(this.selectedQuarter)) {
        throw new Error('Invalid quarter data');
      }

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
      this.error = `Failed to update quarter: ${(error as Error).message}`;
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
        throw new Error('You do not have permission to update scoring rules');
      }

      await firstValueFrom(this.firebaseService.updateScoringRules(this.scoringRules));
      this.successMessage = 'Scoring rules updated successfully';
      this.error = null;
    } catch (error) {
      this.error = `Failed to update scoring rules: ${(error as Error).message}`;
      this.successMessage = null;
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