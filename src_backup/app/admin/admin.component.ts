import { Component, OnInit } from '@angular/core';
import { FirebaseService, Quarter } from '../services/firebase.service';

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
  scoringRules: any = {
    agePerfectScore: 20,
    ageBonus: 10,
    agePenaltyPerYear: 4,
    proofPerfectScore: 20,
    proofBonus: 10,
    proofPenaltyPerPoint: 2,
    mashbillCorrectScore: 10
  };

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadQuarters();
  }

  loadQuarters() {
    this.firebaseService.getQuarters().subscribe(quarters => {
      this.quarters = quarters;
    });
  }

  selectQuarter(quarter: Quarter) {
    this.selectedQuarter = { ...quarter };
  }

  updateQuarter() {
    if (this.selectedQuarter && this.selectedQuarter.id) {
      this.firebaseService.updateQuarter(this.selectedQuarter.id, this.selectedQuarter).subscribe(
        () => {
          console.log('Quarter updated successfully');
          this.loadQuarters();
        },
        error => console.error('Error updating quarter:', error)
      );
    }
  }

  createNewQuarter() {
    this.firebaseService.createNewQuarter(this.newQuarter).subscribe(
      () => {
        console.log('New quarter created successfully');
        this.loadQuarters();
        this.newQuarter = this.initializeNewQuarter();
      },
      error => console.error('Error creating new quarter:', error)
    );
  }

  createCustomEvent() {
    // Implement custom event creation logic
    console.log('Creating custom event:', this.customEvent);
  }

  updateScoringRules() {
    // Implement scoring rules update logic
    console.log('Updating scoring rules:', this.scoringRules);
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
}