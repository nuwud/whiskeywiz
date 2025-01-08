import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { map, catchError, retry, timeout } from 'rxjs/operators';
import { ShopifyProduct } from '../shared/models/quarter.model';

// Enhanced interface for cart operations
export interface CartItem {
  id: string;
  quantity: number;
  title?: string;
  price?: number;
}

// Cart state interface
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {
  private readonly shopifyDomain: string;
  private readonly NETWORK_TIMEOUT = 10000; // 10 seconds
  
  constructor(private http: HttpClient) {
    this.shopifyDomain = window.location.hostname.includes('localhost') 
      ? 'blind-barrels.myshopify.com' 
      : window.location.hostname;
  }

  // Enhanced error handling for network requests
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Backend returned unsuccessful response code
      errorMessage = `Server error: ${error.status} - ${error.error?.message || error.statusText}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Add to cart with enhanced error handling and retry logic
  addToCart(variantId: string, quantity: number = 1): Observable<void> {
    const formData = {
      items: [{
        id: variantId,
        quantity: quantity
      }]
    };

    return this.http.post<any>(`https://${this.shopifyDomain}/cart/add.js`, formData)
      .pipe(
        timeout(this.NETWORK_TIMEOUT),
        retry(2),
        map(() => {
          this.refreshCart();
        }),
        catchError(this.handleError)
      );
  }

  // Get current cart state
  getCartState(): Observable<CartState> {
    return this.http.get<any>(`https://${this.shopifyDomain}/cart.js`)
      .pipe(
        timeout(this.NETWORK_TIMEOUT),
        map(cartData => ({
          items: cartData.items.map(item => ({
            id: item.variant_id.toString(),
            quantity: item.quantity,
            title: item.title,
            price: item.price
          })),
          totalItems: cartData.item_count,
          totalPrice: cartData.total_price / 100 // Convert cents to dollars
        })),
        catchError(this.handleError)
      );
  }

  // Remove item from cart
  removeFromCart(lineItemId: string): Observable<void> {
    return this.http.post<void>(`https://${this.shopifyDomain}/cart/change.js`, {
      id: lineItemId,
      quantity: 0
    }).pipe(
      timeout(this.NETWORK_TIMEOUT),
      map(() => this.refreshCart()),
      catchError(this.handleError)
    );
  }

  // Update cart item quantity
  updateCartItemQuantity(lineItemId: string, quantity: number): Observable<void> {
    return this.http.post<void>(`https://${this.shopifyDomain}/cart/change.js`, {
      id: lineItemId,
      quantity: quantity
    }).pipe(
      timeout(this.NETWORK_TIMEOUT),
      map(() => this.refreshCart()),
      catchError(this.handleError)
    );
  }

  // Fetch product details with more robust error handling
  getProduct(handle: string): Observable<ShopifyProduct> {
    return this.http.get<any>(`https://${this.shopifyDomain}/products/${handle}.js`)
      .pipe(
        timeout(this.NETWORK_TIMEOUT),
        map(response => ({
          id: response.id.toString(),
          title: response.title,
          handle: response.handle,
          variantId: response.variants[0].id.toString(),
          price: response.variants[0].price,
          available: response.available,
          description: response.description || '',
          images: response.images || []
        })),
        catchError(this.handleError)
      );
  }

  // Refresh cart (trigger UI updates)
  private refreshCart(): void {
    try {
      // Dispatch custom events for various cart-related UI components
      const refreshEvents = [
        new CustomEvent('cart:refresh'),
        new CustomEvent('cart:updated')
      ];
      
      refreshEvents.forEach(event => window.dispatchEvent(event));
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  }

  // Checkout methods
  initiateCheckout(): Observable<string> {
    return this.http.post<{checkout_url: string}>(`https://${this.shopifyDomain}/cart/prepare_url.json`, {})
      .pipe(
        timeout(this.NETWORK_TIMEOUT),
        map(response => response.checkout_url),
        catchError(this.handleError)
      );
  }
}
