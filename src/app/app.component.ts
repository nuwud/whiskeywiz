import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated();

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Handle navigation events
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Log navigation
      console.log('Navigation completed:', event.urlAfterRedirects);
      
      // Handle hash-based URLs
      if (event.urlAfterRedirects === '/') {
        const hash = window.location.hash;
        if (hash) {
          const route = hash.substring(1); // Remove the # character
          console.log('Handling hash route:', route);
          this.router.navigate([route], { replaceUrl: true });
        } else {
          // Default route if no hash
          this.router.navigate(['/game'], { replaceUrl: true });
        }
      }
    });

    // Initialize auth state
    this.isAuthenticated$.subscribe(
      isAuth => console.log('Auth state:', isAuth),
      error => console.error('Auth error:', error)
    );
  }
}
