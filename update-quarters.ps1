# update-quarters.ps1

# Get the base directory for quarters
$quartersDir = "C:\Users\Nuwud\whiskey-wiz\src\app\quarters"

# Function to convert quarter ID to quarter name
function Get-QuarterName {
    param (
        [string]$quarterId
    )
    
    try {
        $monthNum = $quarterId.Substring(0,2)
        $year = "20" + $quarterId.Substring(2,2)
        
        $monthNames = @{
            "01" = "January"
            "03" = "March"
            "06" = "June"
            "09" = "September"
            "12" = "December"
        }
        
        $monthName = $monthNames[$monthNum]
        if ($null -eq $monthName) {
            Write-Warning "Invalid month number: $monthNum"
            return "Unknown Month $year"
        }
        return "$monthName $year"
    }
    catch {
        Write-Warning "Error processing quarter ID: $quarterId"
        return "Unknown Quarter"
    }
}

# Function to generate component content
function Get-ComponentContent {
    param (
        [string]$quarterId,
        [string]$quarterName,
        [string]$className
    )
    
    return @"
import { Component, Input } from '@angular/core';
import { BaseQuarterComponent } from '../base-quarter.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-quarter-$quarterId',
  template: `
    <app-game-banner 
      [quarterId]="quarterId"
      [quarterName]="quarterName">
    </app-game-banner>
    <div *ngIf="!quarterData">Loading...</div>
    <div *ngIf="quarterData">
      <h2>{{ quarterData?.name || '$quarterName' }}</h2>
      <div *ngIf="!gameCompleted">
        <form (ngSubmit)="onSubmit(guessForm)" #guessForm="ngForm">
          <div>
            <label for="ageGuess">Age Guess:</label>
            <input type="number" id="ageGuess" name="ageGuess" [(ngModel)]="guess.age" required min="0" #ageGuess="ngModel">
            <div *ngIf="ageGuess.invalid && (ageGuess.dirty || ageGuess.touched)">
              <small *ngIf="ageGuess.errors?.['required']">Age guess is required.</small>
              <small *ngIf="ageGuess.errors?.['min']">Age must be 0 or greater.</small>
            </div>
          </div>
          <div>
            <label for="proofGuess">Proof Guess:</label>
            <input type="number" id="proofGuess" name="proofGuess" [(ngModel)]="guess.proof" required min="0" max="200" #proofGuess="ngModel">
            <div *ngIf="proofGuess.invalid && (proofGuess.dirty || proofGuess.touched)">
              <small *ngIf="proofGuess.errors?.['required']">Proof guess is required.</small>
              <small *ngIf="proofGuess.errors?.['min']">Proof must be 0 or greater.</small>
              <small *ngIf="proofGuess.errors?.['max']">Proof must be 200 or less.</small>
            </div>
          </div>
          <div>
            <label for="mashbillGuess">Mashbill Guess:</label>
            <select id="mashbillGuess" name="mashbillGuess" [(ngModel)]="guess.mashbill" required #mashbillGuess="ngModel">
              <option value="Bourbon">Bourbon</option>
              <option value="Rye">Rye</option>
              <option value="Wheat">Wheat</option>
              <option value="Single Malt">Single Malt</option>
            </select>
            <div *ngIf="mashbillGuess.invalid && (mashbillGuess.dirty || mashbillGuess.touched)">
              <small *ngIf="mashbillGuess.errors?.['required']">Mashbill guess is required.</small>
            </div>
          </div>
          <button type="submit" [disabled]="!guessForm.form.valid">Submit Guess</button>
        </form>
      </div>
      <div *ngIf="gameCompleted">
        <h3>Game Completed!</h3>
        <p>Your score: {{ playerScore }}</p>
        <button (click)="submitScore()">Submit Score</button>
      </div>
    </div>
  `,
  styles: [\`
    /* Add any specific styles here */
    small {
      color: red;
    }
  \`]
})
export class $className extends BaseQuarterComponent {
  @Input() override quarterId: string = '$quarterId';
  @Input() quarterName: string = '$quarterName';

  constructor(
    firebaseService: FirebaseService,
    authService: AuthService
  ) {
    super(firebaseService, authService);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const guess: { age: number; proof: number; mashbill: string } = {
        age: form.value.ageGuess,
        proof: form.value.proofGuess,
        mashbill: form.value.mashbillGuess
      };
      super.submitGuess(guess);
    }
  }
}
"@
}

# Get all quarter component files
$quarterFiles = Get-ChildItem -Path $quartersDir -Filter "*.component.ts" -Recurse | 
    Where-Object { $_.Name -match '^\d{4}\.component\.ts$' }

# Process each quarter component
foreach ($file in $quarterFiles) {
    try {
        # Extract quarter ID from file path
        $quarterId = $file.Directory.Name
        $quarterName = Get-QuarterName $quarterId
        $className = "Q${quarterId}Component"
        
        Write-Host "Processing $($file.Name) for $quarterName..."
        
        # Create backup of original file
        Copy-Item $file.FullName "$($file.FullName).bak"
        
        # Generate new content
        $newContent = Get-ComponentContent -quarterId $quarterId -quarterName $quarterName -className $className
        
        # Write new content to file
        $newContent | Set-Content $file.FullName -Force -Encoding UTF8
        
        Write-Host "Successfully updated $($file.Name) with new content for $quarterName"
    }
    catch {
        Write-Error "Failed to process $($file.Name): $_"
    }
}

Write-Host "`nAll quarter components have been updated. Backups have been created with .bak extension."
Write-Host "Please review the changes before committing."