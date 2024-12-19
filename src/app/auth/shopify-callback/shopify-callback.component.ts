// src/app/auth/shopify-callback/shopify-callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopifyService } from '../../services/shopify.service';

@Component({
  selector: 'app-shopify-callback',
  template: `
    <div class="callback-container">
      <h2>Connecting to Shopify...</h2>
    </div>
  `
})
export class ShopifyCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shopifyService: ShopifyService
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.shopifyService.handleCallback(code).subscribe(
        () => {
          // Redirect back to game or dashboard
          this.router.navigate(['/game']);
        },
        error => {
          console.error('Shopify auth error:', error);
          this.router.navigate(['/error']);
        }
      );
    }
  }
}