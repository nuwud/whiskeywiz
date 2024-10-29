# adminnav.ps1

$basePath = "src\app\admin-nav"
$componentName = "admin-nav"

# Create directory
New-Item -ItemType Directory -Force -Path $basePath

# Create component files with single quotes to preserve $ characters
'import { Component, OnInit } from ''@angular/core'';
import { Router } from ''@angular/router'';
import { Observable } from ''rxjs'';
import { map } from ''rxjs/operators'';
import { AuthService } from ''../services/auth.service'';
import { FirebaseService } from ''../services/firebase.service'';
import { Quarter } from ''../shared/models/quarter.model'';

@Component({
  selector: ''app-admin-nav'',
  templateUrl: ''./admin-nav.component.html'',
  styleUrls: [''./admin-nav.component.css'']
})
export class AdminNavComponent implements OnInit {
  isAdmin$: Observable<boolean>;
  quarters$: Observable<Quarter[]>;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    this.isAdmin$ = this.authService.user$.pipe(
      map(user => user ? this.authService.isAdmin(user.email || '''') : false)
    );
    this.quarters$ = this.firebaseService.getQuarters();
  }

  ngOnInit() {}

  navigateToQuarter(event: any) {
    const quarterId = event.target.value;
    if (quarterId) {
      this.router.navigate([''/player''], { queryParams: { quarter: quarterId }});
    }
  }

  logout() {
    this.authService.signOut();
    this.router.navigate([''/login'']);
  }
}' | Out-File -FilePath "$basePath\$componentName.component.ts" -Encoding utf8

'<nav *ngIf="isAdmin$ | async" class="admin-nav">
  <a routerLink="/admin" routerLinkActive="active">Admin Panel</a>
  <a routerLink="/player" routerLinkActive="active">Play Game</a>
  
  <div class="quarter-links" *ngIf="quarters$ | async as quarters">
    <select (change)="navigateToQuarter($event)">
      <option value="">Select Quarter</option>
      <option *ngFor="let quarter of quarters" [value]="quarter.id">
        {{quarter.name}}
      </option>
    </select>
  </div>
  
  <button (click)="logout()" class="logout-btn">Logout</button>
</nav>' | Out-File -FilePath "$basePath\$componentName.component.html" -Encoding utf8

'.admin-nav {
  background: #f8f9fa;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}

.admin-nav a {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.admin-nav a.active {
  background: #4CAF50;
  color: white;
}

.admin-nav a:hover:not(.active) {
  background: #e9ecef;
}

.quarter-links {
  flex: 1;
}

.quarter-links select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  min-width: 200px;
}

.logout-btn {
  margin-left: auto;
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background: #c82333;
}' | Out-File -FilePath "$basePath\$componentName.component.css" -Encoding utf8

Write-Host "Admin nav component files created successfully!"