import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Quarter } from '../../shared/models/quarter.model';

@Component({
  selector: 'app-admin-quarters',
  template: `
    <div class="quarters-management">
      <header class="header">
        <h2>Quarters Management</h2>
        <button class="add-button" (click)="addNewQuarter()">
          Add New Quarter
        </button>
      </header>
      
      <div class="quarters-list" *ngIf="quarters.length > 0">
        <div *ngFor="let quarter of quarters" class="quarter-item">
          <div class="quarter-info">
            <span class="quarter-id">{{formatQuarter(quarter.id)}}</span>
            <span class="quarter-status" [class.active]="quarter.active">
              {{ quarter.active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="quarter-actions">
            <button (click)="previewQuarter(quarter.id)" class="preview-button">
              Preview
            </button>
            <button (click)="editQuarter(quarter.id)" class="edit-button">
              Edit
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="quarters.length === 0" class="no-quarters">
        No quarters available. Click 'Add New Quarter' to create one.
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .quarters-management {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .quarter-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .quarter-info {
      display: flex;
      gap: 15px;
      align-items: center;
    }
    .quarter-status {
      padding: 4px 8px;
      border-radius: 12px;
      background: #eee;
      font-size: 0.9em;
    }
    .quarter-status.active {
      background: #e6f4ea;
      color: #137333;
    }
    .quarter-actions {
      display: flex;
      gap: 10px;
    }
    .error-message {
      color: #d32f2f;
      margin-top: 20px;
    }
    .no-quarters {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class AdminQuartersComponent implements OnInit {
  quarters: Quarter[] = [];
  error: string = '';

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.loadQuarters();
  }

  async loadQuarters() {
    try {
      // Sort quarters by ID (MMYY) in descending order
      const quarters = await this.firebaseService.getQuarters();
      this.quarters = quarters.sort((a, b) => b.id.localeCompare(a.id));
    } catch (error) {
      this.error = 'Error loading quarters';
      console.error('Error:', error);
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
    this.router.navigate(['/admin/quarters', mmyy, 'edit']);
  }

  previewQuarter(mmyy: string) {
    // Open in new tab to maintain admin context
    window.open(`/#/quarters/${mmyy}`, '_blank');
  }

  addNewQuarter() {
    this.router.navigate(['/admin/quarters/new']);
  }
}