import { Component, OnInit } from '@angular/core';
import { FirebaseService, Quarter } from '../services/firebase.service';
import { QuarterPopulationService } from '../services/quarter-population.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  quarters: Quarter[] = [];
  selectedQuarter: Quarter | null = null;
  newQuarter: Quarter = this.initializeNewQuarter();
  customEvent: any = {};
  isPopulating: boolean = false;
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
    private quarterPopulation: QuarterPopulationService
  ) {
    this.quarterPopulation.isPopulating$.subscribe(
      isPopulating => this.isPopulating = isPopulating
    );
  }

  ngOnInit() {
    this.loadQuarters();
  }

  async loadQuarters() {
    try {
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
    } catch (error) {
      console.error('Error in loadQuarters:', error);
      this.error = 'An unexpected error occurred while loading quarters.';
    }
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
      await this.loadQuarters();
      this.error = null;
    } catch (error) {
      console.error('Error updating quarter:', error);
      this.error = 'Failed to update quarter. Please try again.';
    }
  }

  async createNewQuarter() {
    try {
      await this.firebaseService.createNewQuarter(this.newQuarter).toPromise();
      console.log('New quarter created successfully');
      await this.loadQuarters();
      this.newQuarter = this.initializeNewQuarter();
      this.error = null;
    } catch (error) {
      console.error('Error creating new quarter:', error);
      this.error = 'Failed to create new quarter. Please try again.';
    }
  }

  async populateQuarters() {
    if (this.isPopulating) return;

    try {
      this.isPopulating = true;
      this.error = null;
      await this.quarterPopulation.populateQuarters();
      console.log('All quarters populated successfully');
      await this.loadQuarters();
    } catch (error) {
      console.error('Error populating quarters:', error);
      this.error = 'Failed to populate quarters. Please try again.';
    } finally {
      this.isPopulating = false;
    }
  }

  async updateScoringRules() {
    try {
      // Assuming you have a method in FirebaseService to update scoring rules
      await this.firebaseService.updateScoringRules(this.scoringRules).toPromise();
      console.log('Scoring rules updated successfully');
      this.error = null;
    } catch (error) {
      console.error('Error updating scoring rules:', error);
      this.error = 'Failed to update scoring rules. Please try again.';
    }
  }

  createCustomEvent() {
    // TODO: Implement custom event creation logic
    console.log('Creating custom event:', this.customEvent);
  }

  private initializeNewQuarter(): Quarter {
    const now = new Date();
    const startOfNextQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 1);
    const endOfNextQuarter = new Date(startOfNextQuarter.getFullYear(), startOfNextQuarter.getMonth() + 3, 0);

    return {
      name: `Q${Math.floor(startOfNextQuarter.getMonth() / 3) + 1} ${startOfNextQuarter.getFullYear()}`,
      startDate: startOfNextQuarter,
      endDate: endOfNextQuarter,
      active: false,
      samples: {
        sample1: { mashbill: "Bourbon", proof: 90, age: 4 },
        sample2: { mashbill: "Rye", proof: 100, age: 6 },
        sample3: { mashbill: "Wheat", proof: 92, age: 5 },
        sample4: { mashbill: "Single Malt", proof: 86, age: 8 }
      }
    };
  }

  // Helper method to clear error
  clearError() {
    this.error = null;
  }
}