import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ShopifyProduct } from '../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {
  private readonly shopifyDomain: string;
  
  constructor(private http: HttpClient) {
    this.shopifyDomain = window.location.hostname.includes('localhost') 
      ? 'blind-barrels.myshopify.com' 
      : window.location.hostname;
  }

  addToCart(variantId: string, quantity: number = 1): Observable<void> {
    const formData = {
      items: [{
        id: variantId,
        quantity: quantity
      }]
    };

    return this.http.post<any>(`https://${this.shopifyDomain}/cart/add.js`, formData)
      .pipe(
        map(() => {
          // Trigger cart refresh
          this.refreshCart();
        }),
        catchError(error => {
          console.error('Error adding to cart:', error);
          throw error;
        })
      );
  }

  private refreshCart(): void {
    // If using Shopify's cart drawer
    const refreshEvent = new CustomEvent('cart:refresh');
    window.dispatchEvent(refreshEvent);
  }

  getProduct(handle: string): Observable<ShopifyProduct> {
    return this.http.get<any>(`https://${this.shopifyDomain}/products/${handle}.js`)
      .pipe(
        map(response => ({
          id: response.id.toString(),
          title: response.title,
          handle: response.handle,
          variantId: response.variants[0].id.toString(),
          price: response.variants[0].price,
          available: response.available
        }))
      );
  }
}