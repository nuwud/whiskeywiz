﻿import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { Quarter } from '../shared/models/quarter.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
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
      switchMap(user => user ? this.authService.isAdmin() : of(false))
    );
    this.quarters$ = this.firebaseService.getQuarters();
  }

  ngOnInit() {}

  navigateToQuarter(event: any) {
    const quarterId = event.target.value;
    if (quarterId) {
      this.router.navigate(['/player'], { queryParams: { quarter: quarterId }});
    }
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
function switchMap(arg0: (user: any) => any): import("rxjs").OperatorFunction<import("@firebase/auth").User | null, boolean> {
  throw new Error('Function not implemented.');
}
