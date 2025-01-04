import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated();
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Handle navigation errors
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Clear any previous error states
      console.log('Navigation completed successfully');
    });

    // Initialize auth state
    this.isAuthenticated$.subscribe(
      isAuth => console.log('Auth state:', isAuth),
      error => console.error('Auth error:', error)
    );
  }
}
