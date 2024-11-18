// auth.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

interface UserData {
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;
  private readonly shopifyConfig = environment.shopify;
  private readonly adminEmails = ['nuwudorder@gmail.com', 'bobby@blindbarrels.com'];

  createGuestSession(): Observable<string> {
    return of(this.generateGuestId()).pipe(
      tap(guestId => localStorage.setItem('guestId', guestId))
    );
  }

  private generateGuestId(): string {
    return 'guest_' + Math.random().toString(36).substr(2, 9);
  }

  getPlayerId(): Observable<string> {
    return this.user$.pipe(
      switchMap(user => {
        if (user) return of(user.uid);
        const guestId = localStorage.getItem('guestId');
        if (guestId) return of(guestId);
        return this.createGuestSession();
      })
    );
  }

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.user$ = this.afAuth.authState;
  }

  // Authentication methods
  async signIn(email: string, password: string) {
    try {
      console.log('Attempting sign in...', { email });
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Sign in successful', result);
      
      // Check and update admin status
      if (result.user) {
        await this.afs.doc(`users/${result.user.uid}`).set({
          email: result.user.email,
          isAdmin: this.adminEmails.includes(email),
          lastLogin: new Date()
        }, { merge: true });
      }
      
      console.log('Sign in successful', result);
      
      return result;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  shopifyDomain = 'https://blind-barrels.myshopify.com'; 
  
  async connectWithShopify() {
    const shopifyAuthUrl = `${this.shopifyConfig.shopName}/admin/oauth/authorize?` +
      `client_id=${this.shopifyConfig.apiKey}&` +
      `redirect_uri=${encodeURIComponent(this.shopifyConfig.redirectUri)}&` +
      `scope=read_customers,write_customers`;
    
    window.location.href = shopifyAuthUrl;
  }

  async handleShopifyCallback(code: string) {
    // Exchange code for token and create/update user
  }

  async register(email: string, password: string) {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (credential.user) {
        await this.updateUserData(credential.user);
        return credential.user;
      }
      throw new Error('User creation failed');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  async signOut() {
    return this.afAuth.signOut();
  }

  async transferGuestScores(guestId: string, newUserEmail: string): Promise<void> {
    try {
      const batch = this.afs.firestore.batch();
      
      // Get all scores for guest
      const guestScores = await this.afs.collection('scores')
        .ref.where('playerId', '==', guestId).get();
      
      // Update each score with new user ID
      guestScores.docs.forEach(doc => {
        const scoreData = doc.data();
        batch.update(doc.ref, {
          playerId: newUserEmail,
          isGuest: false,
          playerName: newUserEmail
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error transferring guest scores:', error);
      throw error;
    }
  }  

  // User data methods
  private async updateUserData(user: any) {
    const userRef: AngularFirestoreDocument<UserData> = this.afs.doc(`users/${user.uid}`);
    
    const data: UserData = {
      email: user.email,
      isAdmin: this.adminEmails.includes(user.email),
      createdAt: new Date()
    };

    return userRef.set(data, { merge: true });
  }

  // Auth state checks
  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      tap(user => console.log('Auth state:', user)),
      map(user => !!user),
      catchError(() => of(false))
    );
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      switchMap(user => {
        if (!user) return of(false);
        return this.afs.doc<UserData>(`users/${user.uid}`).valueChanges().pipe(
          map(userData => userData?.isAdmin || false),
          catchError(() => of(false))
        );
      })
    );
  }

  // Helper method for synchrous admin check (useful for immediate checks)
  isAdminSync(email: string | null): boolean {
    if (!email) return false;
    return this.adminEmails.includes(email);
  }

  getCurrentUserId(): Observable<string | null> {
    return this.user$.pipe(
      map(user => user?.uid || null)
    );
  }

  private handleAuthError(error: any): Error {
    let message = 'An authentication error occurred';
    
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        message = 'This email is already registered';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
      case 'auth/network-request-failed':
        message = 'Network error - please check your connection';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later';
        break;
        case 'permission-denied':
        message = 'Missing or insufficient permissions';
        break;
      default:
        message = error.message || message;
    }

    return new Error(message);
  }


}