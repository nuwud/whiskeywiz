// src/app/services/shopify.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {
  private config = environment.shopify;

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  initiateAuth(): void {
    const authUrl = `https://${this.config.shopName}/admin/oauth/authorize?` +
      `client_id=${this.config.apiKey}&` +
      `redirect_uri=${encodeURIComponent(this.config.redirectUri)}&` +
      `scope=read_customers,write_customers`;
    
    window.location.href = authUrl;
  }

  handleCallback(code: string): Observable<any> {
    // Store the auth code temporarily
    return this.authService.getCurrentUserId().pipe(
      switchMap(userId => {
        if (!userId) throw new Error('No authenticated user');
        
        return from(this.firestore.collection('shopifyAuth').doc(userId).set({
          code,
          timestamp: new Date()
        }));
      })
    );
  }

  // Method to check if user has Shopify connection
  isShopifyConnected(): Observable<boolean> {
    return this.authService.getCurrentUserId().pipe(
      switchMap(userId => {
        if (!userId) return from([false]);
        return this.firestore.collection('shopifyAuth').doc(userId).get();
      }),
      map(doc => doc && typeof doc !== 'boolean' && doc.exists)
    );
  }
}