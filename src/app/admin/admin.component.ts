// src/app/admin/admin.component.ts
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Quarter, ScoringRules } from '../shared/models/quarter.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; 
import { firstValueFrom } from 'rxjs';

// Removed local declaration of Quarter interface

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  quarters: Quarter[] = [];
  selectedQuarter: Quarter | null = null;
  error: string | null = null;
  successMessage: string | null = null;

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
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
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

  navigateToQuarter(quarterId: string | undefined) {
    if (!quarterId) {
      console.error('No quarter ID provided');
      return;
    }
    this.router.navigate(['/player'], { queryParams: { quarter: quarterId }});
  }

  async selectQuarter(quarter: Quarter) {
    if (!quarter) {
      console.error('Invalid quarter selected');
      return;
    }
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
      if (this.selectedQuarter.active) {
        // Deactivate other active quarters
        const deactivatePromises = this.quarters
          .filter(q => q.id && q.id !== this.selectedQuarter?.id && q.active)
          .map(q => firstValueFrom(
            this.firebaseService.updateQuarter(q.id!, { ...q, active: false })
          ));
        
        await Promise.all(deactivatePromises);
      }
  
      // Update selected quarter
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

  clearMessages() {
    this.error = null;
    this.successMessage = null;
  }

  async updateScoringRules() {
    try {
      await firstValueFrom(this.firebaseService.updateScoringRules(this.scoringRules));
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