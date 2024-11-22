import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-button',
  template: `
    <button 
      (click)="openAuthModal()"
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false"
      class="auth-button">
      <img 
        [src]="getButtonImage()" 
        [alt]="isLoggedIn ? 'Logout' : 'Login'"
        class="auth-image">
    </button>

    <div *ngIf="showAuthModal" class="auth-modal">
      <div class="auth-modal-content">
        <app-login 
          [returnQuarter]="currentQuarter"
          (authComplete)="handleAuthComplete($event)">
        </app-login>
      </div>
    </div>
  `,
  styles: [`
    .auth-button {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }

    .auth-image {
      width: 125px;
      height: auto;
      transition: transform 0.2s ease;
    }

    .auth-button:hover .auth-image {
      transform: scale(1.05);
    }

    .auth-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .auth-modal-content {
      background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
      border: 2px solid #FFD700;
      border-radius: 8px;
      padding: 2rem;
      max-width: 90%;
      width: 400px;
    }
  `]
})
export class AuthButtonComponent implements OnInit, OnDestroy {
  @Input() currentQuarter: string = '';
  isLoggedIn = false;
  isHovered = false;
  showAuthModal = false;
  private authSubscription?: Subscription;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated()
      .subscribe(isAuth => {
        this.isLoggedIn = isAuth;
      });
    this.route.queryParams.subscribe(params => {
        this.currentQuarter = params['quarter'] || '';
      });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  get buttonImage(): string {
    return this.getImagePath(
      this.isLoggedIn 
        ? this.isHovered ? 'Logout_Button_Hover.png' : 'Logout_Button.png'
        : this.isHovered ? 'Login_Button_Hover.png' : 'Login_Button.png'
    );
  }

  get buttonAlt(): string {
    return this.isLoggedIn ? 'Logout' : 'Login';
  }

  getButtonImage(): string {
    const baseImage = this.isLoggedIn ? 'Logout' : 'Login';
    const state = this.isHovered ? '_Hover' : '';
    return `assets/images/${baseImage}_Button${state}.png`;
  }

  openAuthModal(): void {
    this.showAuthModal = true;
  }

  handleAuthComplete(success: boolean): void {
    this.showAuthModal = false;
    if (success) {
      // Handle successful auth
      this.router.navigate(['/game'], { queryParams: { quarter: this.currentQuarter } });
      
    }
  }

  private getImagePath(filename: string): string {
    return `assets/images/${filename}`;
  }

  async handleAuth(): Promise<void> {
    if (this.isLoggedIn) {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } else {
      const currentUrl = this.router.url;
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: currentUrl }
      });
    }
  }
}