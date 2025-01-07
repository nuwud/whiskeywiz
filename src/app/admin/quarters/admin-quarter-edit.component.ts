import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Quarter } from '../../shared/models/quarter.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-quarter-edit',
  template: `
    <div class="quarter-edit">
      <h2>{{ isNew ? 'Create New Quarter' : 'Edit Quarter' }}</h2>

      <form [formGroup]="quarterForm" (ngSubmit)="onSubmit()" *ngIf="quarterForm">
        <!-- Quarter ID -->
        <div class="form-group">
          <label for="id">Quarter ID (MMYY)</label>
          <input
            id="id"
            type="text"
            formControlName="id"
            [readonly]="!isNew"
            placeholder="0324">
          <small *ngIf="quarterForm.get('id')?.errors?.['pattern']">
            Must be in MMYY format (e.g., 0324)
          </small>
        </div>

        <!-- Quarter Name -->
        <div class="form-group">
          <label for="name">Quarter Name</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            placeholder="March 2024">
        </div>

        <!-- Active Status -->
        <div class="form-group">
          <label>
            <input type="checkbox" formControlName="active">
            Active
          </label>
        </div>

        <!-- Video URL -->
        <div class="form-group">
          <label for="videoUrl">Video URL (optional)</label>
          <input
            id="videoUrl"
            type="url"
            formControlName="videoUrl"
            placeholder="https://...">
        </div>

        <!-- Samples -->
        <div formGroupName="samples">
          <h3>Samples</h3>
          <!-- Add sample inputs as needed -->
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="submit" [disabled]="!quarterForm.valid || saving">
            {{ saving ? 'Saving...' : 'Save Quarter' }}
          </button>
          <button type="button" (click)="onCancel()">
            Cancel
          </button>
        </div>
      </form>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .quarter-edit {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
    }
    .form-group input[type="text"],
    .form-group input[type="url"] {
      width: 100%;
      padding: 8px;
    }
    .error-message {
      color: red;
      margin-top: 20px;
    }
    .form-actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }
  `]
})
export class AdminQuarterEditComponent implements OnInit {
  quarterId!: string;
  quarterForm: FormGroup;
  isNew: boolean = true;
  saving: boolean = false;
  error: string = '';

  private mmyyPattern = /^(0[1-9]|1[0-2])(2[0-9]|[3-9][0-9])$/;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    this.quarterForm = this.createForm();
  }

  ngOnInit() {
    const mmyy = this.route.snapshot.params['mmyy'];
    if (mmyy) {
      this.isNew = false;
      this.loadQuarter(mmyy);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: ['', [Validators.required, Validators.pattern(this.mmyyPattern)]],
      name: ['', Validators.required],
      active: [false],
      videoUrl: [''],
      samples: this.fb.group({})
    });
  }

  private async loadQuarter(mmyy: string) {
    try {
      const quarter = await this.firebaseService.getQuarterById(mmyy)
        .toPromise();
      if (quarter) {
        this.quarterForm.patchValue(quarter);
      } else {
        this.error = 'Quarter not found';
      }
    } catch (error) {
      this.error = 'Error loading quarter';
      console.error('Error:', error);
    }
  }

  async onSubmit() {
    if (this.quarterForm.valid) {
      this.saving = true;
      this.error = '';

      try {
        const quarterData = this.quarterForm.value;
        await this.firebaseService.saveQuarter(quarterData);
        await this.router.navigate(['/admin/quarters']);
      } catch (error) {
        this.error = 'Error saving quarter';
        console.error('Error:', error);
      } finally {
        this.saving = false;
      }
    }
  }

  onCancel() {
    this.router.navigate(['/admin/quarters']);
  }
}