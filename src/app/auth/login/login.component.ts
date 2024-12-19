// login.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  error: string = '';
  returnQuarter: string = '';

  constructor(
    public authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute  // Add ActivatedRoute
  ) {}

  ngOnInit() {
    // Get quarter from route params and localStorage
    this.route.queryParams.subscribe(params => {
      this.returnQuarter = params['quarter'] || localStorage.getItem('lastPlayedQuarter');
      console.log('Return quarter:', this.returnQuarter);
    });
  }

  async playAsGuest() {
    this.authService.createGuestSession().subscribe(() => {
      // Navigate to game with quarter if available
      if (this.returnQuarter) {
        this.router.navigate(['/game'], { 
          queryParams: { quarter: this.returnQuarter }
        });
      } else {
        // Let the game component determine the latest/appropriate quarter
        this.router.navigate(['/game']);
      }
    });
  }

  goToRegister() {
    // Preserve quarter parameter when going to register
    this.router.navigate(['/register'], {
      queryParams: this.returnQuarter ? { quarter: this.returnQuarter } : {}
    });
  }

  async login() {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }
  
    try {
      const result = await this.authService.signIn(this.email, this.password);
      
      // Check for return URL
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/game';
      const quarter = this.route.snapshot.queryParams['quarter'];

    // Store the user's email as playerName
    if (result?.user?.email) {
      localStorage.setItem('playerName', result.user.email);
    }
    
    // Navigate directly to game with quarter if available
    if (quarter) {
      this.router.navigate(['/game'], { queryParams: { quarter } });
    } else {
      this.router.navigateByUrl(returnUrl);
    }

    } catch (error: any) {
      console.error('Login error:', error);
      this.error = error.message || 'Failed to log in';
    }
  }
}