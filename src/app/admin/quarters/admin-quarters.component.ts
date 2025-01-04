import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-admin-quarters',
  template: `
    <div class="quarters-management">
      <h2>Quarters Management</h2>
      
      <div class="quarters-list">
        <div *ngFor="let quarter of quarters" class="quarter-item">
          <span class="quarter-id">{{formatQuarter(quarter.id)}}</span>
          <div class="quarter-actions">
            <button (click)="editQuarter(quarter.id)">Edit</button>
            <button (click)="previewQuarter(quarter.id)">Preview</button>
          </div>
        </div>
      </div>

      <div class="add-quarter">
        <button (click)="addNewQuarter()">Add New Quarter</button>
      </div>
    </div>
  `,
  styles: [`
    .quarters-management {
      padding: 20px;
    }
    .quarter-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      margin: 5px 0;
      border: 1px solid #ddd;
    }
    .quarter-actions {
      display: flex;
      gap: 10px;
    }
  `]
})
export class AdminQuartersComponent implements OnInit {
  quarters: any[] = [];

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.loadQuarters();
  }

  async loadQuarters() {
    try {
      this.quarters = await this.firebaseService.getQuarters();
    } catch (error) {
      console.error('Error loading quarters:', error);
    }
  }

  formatQuarter(mmyy: string): string {
    if (!mmyy || mmyy.length !== 4) return mmyy;
    const month = parseInt(mmyy.substring(0, 2));
    const year = '20' + mmyy.substring(2, 4);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[month - 1]} ${year}`;
  }

  editQuarter(mmyy: string) {
    // Navigate to quarter editor
    this.router.navigate(['/admin/quarters', mmyy, 'edit']);
  }

  previewQuarter(mmyy: string) {
    // Navigate to quarter preview
    this.router.navigate(['/quarters', mmyy]);
  }

  addNewQuarter() {
    // Navigate to new quarter form
    this.router.navigate(['/admin/quarters/new']);
  }
}