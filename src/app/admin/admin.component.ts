import { Component, OnInit } from '@angular/core';
import { FirebaseService, Quarter } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  quarters: Quarter[] = [];
  selectedQuarter: Quarter | null = null;
  error: string | null = null;

  scoringRules = {
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
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadQuarters();
    this.loadScoringRules();
  }

  copyToClipboard(type: string) {
    let textToCopy = '';
    
    if (type === 'script-tag') {
      textToCopy = '<script src="https://whiskeywiz2.firebaseapp.com/whiskey-wiz.js" defer></script>';
    } else {
      // For quarter tags
      textToCopy = `<whiskey-wiz-${type}></whiskey-wiz-${type}>`;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  async logout() {
    try {
      await this.authService.signOut();
      // You might want to redirect to login page or handle logout success
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  async loadScoringRules() {
    try {
      const rules = await this.firebaseService.getScoringRules().toPromise();
      if (rules) {
        this.scoringRules = rules;
      }
    } catch (error) {
      console.error('Error loading scoring rules:', error);
    }
  }

  loadQuarters() {
    this.firebaseService.getQuarters().subscribe(
      quarters => {
        this.quarters = quarters;
        this.error = null;
      },
      error => {
        console.error('Error loading quarters:', error);
        this.error = 'Failed to load quarters. Please try again.';
      }
    );
  }

  selectQuarter(quarter: Quarter) {
    this.selectedQuarter = { ...quarter };
    this.error = null;
  }

  showScoringRules() {
    this.selectedQuarter = null;
  }

  async updateQuarter() {
    if (!this.selectedQuarter || !this.selectedQuarter.id) {
      this.error = 'No quarter selected for update.';
      return;
    }

    try {
      await this.firebaseService.updateQuarter(this.selectedQuarter.id, this.selectedQuarter).toPromise();
      console.log('Quarter updated successfully');
      this.loadQuarters();
      this.error = null;
    } catch (error) {
      console.error('Error updating quarter:', error);
      this.error = 'Failed to update quarter. Please try again.';
    }
  }

  async updateScoringRules() {
    try {
      await this.firebaseService.updateScoringRules(this.scoringRules).toPromise();
      console.log('Scoring rules updated successfully');
      this.error = null;
    } catch (error) {
      console.error('Error updating scoring rules:', error);
      this.error = 'Failed to update scoring rules. Please try again.';
    }
  }

  clearError() {
    this.error = null;
  }
}