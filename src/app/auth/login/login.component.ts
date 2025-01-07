import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() returnQuarter: string = '';
  @Output() authComplete = new EventEmitter<boolean>();
  
  email: string = '';
  password: string = '';
  error: string = '';
  returnUrl: string = '/';
  isLoading: boolean = false;

  constructor(
    public authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get return parameters
    this.route.queryParams.subscribe(params => {
      this.returnQuarter = params['quarter'] || localStorage.getItem('lastPlayedQuarter');
      this.returnUrl = params['returnUrl'] || '/';
    });

    // Check if already authenticated
    this.authService.isAuthenticated().subscribe(isAuth => {
      if (isAuth) {
        this.handleNavigation();
      }
    });
  }

  private handleNavigation() {
    // Handle different return scenarios
    if (this.returnUrl.startsWith('/admin')) {
      // Check admin status before navigating to admin
      this.authService.isAdmin().subscribe(isAdmin => {
        if (isAdmin) {
          this.router.navigateByUrl(this.returnUrl);
          this.authComplete.emit(true);
        } else {
          this.router.navigate(['/']);
          this.authComplete.emit(false);
        }
      });
    } else if (this.returnQuarter) {
      // Navigate to specific quarter
      this.router.navigate(['/quarters', this.returnQuarter]);
      this.authComplete.emit(true);
    } else {
      // Default navigation
      this.router.navigateByUrl(this.returnUrl);
      this.authComplete.emit(true);
    }
  }

  async playAsGuest() {
    this.isLoading = true;
    try {
      await this.authService.createGuestSession().toPromise();
      if (this.returnQuarter) {
        this.router.navigate(['/quarters', this.returnQuarter]);
      } else {
        this.router.navigate(['/']);
      }
      this.authComplete.emit(true);
    } catch (error) {
      console.error('Guest session error:', error);
      this.error = 'Failed to create guest session';
      this.authComplete.emit(false);
    } finally {
      this.isLoading = false;
    }
  }

  goToRegister() {
    // Preserve return parameters
    const queryParams: any = {};
    if (this.returnQuarter) queryParams.quarter = this.returnQuarter;
    if (this.returnUrl) queryParams.returnUrl = this.returnUrl;
    
    this.router.navigate(['/register'], { queryParams });
  }

  async login() {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }
  
    this.isLoading = true;
    this.error = '';

    try {
      const result = await this.authService.signIn(this.email, this.password);
      
      // Store the user's email as playerName
      if (result?.user?.email) {
        localStorage.setItem('playerName', result.user.email);
      }
      
      // Handle navigation based on user role and return parameters
      this.handleNavigation();
    } catch (error: any) {
      console.error('Login error:', error);
      this.error = error.message || 'Failed to log in';
      this.authComplete.emit(false);
    } finally {
      this.isLoading = false;
    }
  }
}