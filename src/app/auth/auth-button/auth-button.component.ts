import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-button',
  template: `
    <button 
      [class.logged-in]="isLoggedIn"
      (click)="handleAuth()"
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false"
      class="auth-button">
      <img [src]="buttonImage" [alt]="buttonAlt">
    </button>
  `,
  styles: [`
    .auth-button {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      cursor: pointer;
      transition: transform 0.2s ease;
      
      &:hover {
        transform: scale(1.05);
      }
      
      img {
        height: 40px;
        width: auto;
      }
    }
  `]
})
export class AuthButtonComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isHovered = false;
  private authSubscription?: Subscription;
  
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated()
      .subscribe(isAuth => {
        this.isLoggedIn = isAuth;
      });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
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