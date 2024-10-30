# fix-whiskeywiz-templates.ps1

$adminHtmlContent = @'
<div class="admin-container">
  <a href="#" class="logout-link" (click)="logout()">Logout</a>

  <h1>Whiskey Wiz</h1>
  <h2>Whiskey Wiz Admin</h2>

  <button (click)="showScoringRules()">Return to Scoring Rules</button>

  <div class="admin-layout">
    <div class="quarters-list">
      <h3>Quarters</h3>
      <div class="quarter-items">
        <div class="quarter-item" 
             *ngFor="let quarter of quarters" 
             (click)="selectQuarter(quarter)" 
             [class.active]="selectedQuarter?.id === quarter.id">
          {{quarter.name}}
          <span class="quarter-status" 
                [class.active]="quarter.active">
            ({{quarter.active ? 'Active' : 'Inactive'}})
          </span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="scoring-rules" *ngIf="!selectedQuarter">
        <h3>Scoring Rules</h3>
        <div class="scoring-rules-grid">
          <div class="control-group">Perfect Age Score: {{scoringRules.agePerfectScore}}</div>
          <div class="control-group">Age Bonus: {{scoringRules.ageBonus}}</div>
          <div class="control-group">Age Penalty Per Year: {{scoringRules.agePenaltyPerYear}}</div>
          <div class="control-group">Perfect Proof Score: {{scoringRules.proofPerfectScore}}</div>
          <div class="control-group">Proof Bonus: {{scoringRules.proofBonus}}</div>
          <div class="control-group">Proof Penalty Per Point: {{scoringRules.proofPenaltyPerPoint}}</div>
          <div class="control-group">Correct Mashbill Score: {{scoringRules.mashbillCorrectScore}}</div>
        </div>

        <button (click)="updateScoringRules()">Update Scoring Rules</button>

        <div class="quarter-actions">
          <button *ngIf="selectedQuarter?.id" 
                  (click)="navigateToQuarter(selectedQuarter.id)"
                  class="play-button">
            Play Quarter
          </button>
        </div>

        <div class="integration-instructions">
          <h3>Integration Instructions</h3>
          
          <div class="instruction-section">
            <h4>1. Required Script</h4>
            <div class="code-block">
              <code><script src="https://whiskeywiz2.firebaseapp.com/whiskey-wiz.js" defer></script></code>
              <button (click)="copyToClipboard('script-tag')">Copy</button>
            </div>
          </div>

          <div class="instruction-section">
            <h4>2. Admin Panel Integration</h4>
            <div class="code-block">
              <code><whiskey-wiz-admin></whiskey-wiz-admin></code>
              <button (click)="copyToClipboard('admin')">Copy</button>
            </div>
          </div>

          <div class="notes-section">
            <h4>Important Notes</h4>
            <ul>
              <li>The admin panel should only be embedded on admin-specific pages</li>
              <li>Each quarter can be embedded independently</li>
              <li>Components will automatically handle authentication</li>
              <li>Changes made in admin panel affect all embedded instances</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="quarter-editor" *ngIf="selectedQuarter">
        <h3>Editing {{selectedQuarter.name}}</h3>
        
        <div class="editor-section">
          <div class="active-toggle">
            <label>
              <input type="checkbox" 
                     [(ngModel)]="selectedQuarter.active"> 
              Active Quarter
            </label>
          </div>

          <div class="samples-grid">
            <div class="sample-card" *ngFor="let sample of [1,2,3,4]">
              <h4>Sample {{sample}}</h4>
              <div class="form-group">
                <select [(ngModel)]="selectedQuarter.samples['sample' + sample].mashbill">
                  <option value="Bourbon">Bourbon</option>
                  <option value="Rye">Rye</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Single Malt">Single Malt</option>
                </select>
              </div>
              <div class="form-group">
                <label>Proof:</label>
                <input type="number" [(ngModel)]="selectedQuarter.samples['sample' + sample].proof">
              </div>
              <div class="form-group">
                <label>Age:</label>
                <input type="number" [(ngModel)]="selectedQuarter.samples['sample' + sample].age">
              </div>
            </div>
          </div>

          <button (click)="updateQuarter()">Save Changes</button>

          <div class="integration-code" *ngIf="selectedQuarter?.id">
            <h4>Integration Code</h4>
            <div class="code-block">
              <code>&lt;whiskey-wiz-{{selectedQuarter.id}}&gt;&lt;/whiskey-wiz-{{selectedQuarter.id}}&gt;</code>
              <button (click)="copyToClipboard(selectedQuarter.id)">Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
'@

# Get the current directory
$currentDir = Get-Location

# Create backup of existing file
Copy-Item "$currentDir\src\app\admin\admin.component.html" "$currentDir\src\app\admin\admin.component.html.bak"

# Write new content
$adminHtmlContent | Set-Content "$currentDir\src\app\admin\admin.component.html" -Force

Write-Host "Templates have been updated successfully."
Write-Host "Backup of original file created at: $currentDir\src\app\admin\admin.component.html.bak"
Write-Host "Please verify the changes and run 'ng serve' to test the application."