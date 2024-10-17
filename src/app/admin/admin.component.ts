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
    this.selectedQuarter = quarter;
  }

  updateQuarter() {
    if (this.selectedQuarter) {
      this.firebaseService.updateQuarter(this.selectedQuarter.id!, {
        active: this.selectedQuarter.active,
        samples: this.selectedQuarter.samples
      });
    }
  }

  createNextQuarter() {
    const now = new Date();
    const startOfNextQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 1);
    const endOfNextQuarter = new Date(startOfNextQuarter.getFullYear(), startOfNextQuarter.getMonth() + 3, 0);

    const newQuarterData: Quarter = {
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

    this.firebaseService.createNewQuarter(newQuarterData)
      .then(() => this.loadQuarters())
      .catch(error => console.error('Error creating new quarter:', error));
  }
}