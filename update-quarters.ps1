$quarterPath = "C:\Users\Nuwud\whiskey-wiz\src\app\quarters"
$quarterDirs = Get-ChildItem -Path $quarterPath -Directory | Where-Object { $_.Name -match '^\d{4}$' }

foreach ($dir in $quarterDirs) {
    $componentPath = Join-Path $dir.FullName "$($dir.Name).component.ts"
    $quarterId = $dir.Name

    $componentContent = @"
import { Component } from '@angular/core';
import { BaseQuarterComponent } from '../base-quarter.component';
import { FirebaseService } from '../../services/firebase.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-quarter-$quarterId',
  template: ``
    <div *ngIf="quarterData">
      <h2>{{ quarterData.name }}</h2>
      <div *ngIf="!gameCompleted">
        <form (ngSubmit)="submitGuess(guessForm)" #guessForm="ngForm">
          <div>
            <label for="ageGuess">Age Guess:</label>
            <input type="number" id="ageGuess" name="ageGuess" [(ngModel)]="guess.age" required>
          </div>
          <div>
            <label for="proofGuess">Proof Guess:</label>
            <input type="number" id="proofGuess" name="proofGuess" [(ngModel)]="guess.proof" required>
          </div>
          <div>
            <label for="mashbillGuess">Mashbill Guess:</label>
            <select id="mashbillGuess" name="mashbillGuess" [(ngModel)]="guess.mashbill" required>
              <option value="Bourbon">Bourbon</option>
              <option value="Rye">Rye</option>
              <option value="Wheat">Wheat</option>
              <option value="Single Malt">Single Malt</option>
            </select>
          </div>
          <button type="submit">Submit Guess</button>
        </form>
      </div>
      <div *ngIf="gameCompleted">
        <h3>Game Completed!</h3>
        <p>Your score: {{ playerScore }}</p>
        <button (click)="submitScore()">Submit Score</button>
      </div>
    </div>
  ``,
  styles: [``
    /* Add any specific styles here */
  ``]
})
export class Q${quarterId}Component extends BaseQuarterComponent {
  guess = { age: 0, proof: 0, mashbill: '' };

  constructor(firebaseService: FirebaseService) {
    super(firebaseService);
    this.quarterId = '$quarterId';
  }

  submitGuess(form: NgForm) {
    if (form.valid) {
      // Call the parent class method to handle the guess
      super.submitGuess(this.guess);
    }
  }
}
"@

    Set-Content -Path $componentPath -Value $componentContent -Encoding UTF8
    Write-Host "Updated $componentPath"
}

Write-Host "All dated quarter components have been updated."