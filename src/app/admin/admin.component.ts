import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-admin',
  template: `
    <div class="admin-container">
      <nav class="admin-nav">
        <ul>
          <li><a routerLink="./quarters" routerLinkActive="active">Quarters</a></li>
          <li><a routerLink="./analytics" routerLinkActive="active">Analytics</a></li>
        </ul>
      </nav>
      
      <div class="admin-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
    }
    .admin-nav ul {
      list-style: none;
      padding: 0;
      margin: 0 0 20px 0;
      display: flex;
      gap: 20px;
    }
    .admin-nav a {
      text-decoration: none;
      padding: 8px 16px;
    }
    .admin-nav a.active {
      font-weight: bold;
    }
  `]
})
export class AdminComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    // Verify admin access here if needed
  }

  navigateToQuarter(mmyy: string) {
    if (this.isValidMMYY(mmyy)) {
      this.router.navigate(['/quarters', mmyy]);
    }
  }

  private isValidMMYY(mmyy: string): boolean {
    if (!mmyy || mmyy.length !== 4) return false;
    const month = parseInt(mmyy.substring(0, 2));
    const year = parseInt(mmyy.substring(2, 4));
    return month >= 1 && month <= 12 && year >= 20 && year <= 99;
  }
}