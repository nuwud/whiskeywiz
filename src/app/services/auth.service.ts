import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection, query, where, getDocs, writeBatch } from '@angular/fire/firestore';
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
  private readonly shopifyConfig = environment.shopify;
  private readonly adminEmails = ['nuwudorder@gmail.com', 'bobby@blindbarrels.com'];

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  get user$(): Observable<any> {
    return new Observable(subscriber => {
      return this.auth.onAuthStateChanged(subscriber);
    });
  }

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

  // Authentication methods
  async signIn(email: string, password: string) {
    try {
      console.log('Attempting sign in...', { email });
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Check and update admin status
      if (result.user) {
        await setDoc(doc(this.firestore, `users/${result.user.uid}`), {
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

  async register(email: string, password: string) {
    try {
      console.log('Starting registration for:', email);
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      if (!credential.user) {
        throw new Error('No user returned after registration');
      }
  
      // Create user profile in Firestore
      await setDoc(doc(this.firestore, `users/${credential.user.uid}`), {
        email: credential.user.email,
        createdAt: new Date(),
        isGuest: false
      }, { merge: true });
  
      console.log('Registration successful:', credential.user.uid);
      return credential.user;
  
    } catch (error: any) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  async signOut() {
    return signOut(this.auth);
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
        return from(getDocs(doc(this.firestore, `users/${user.uid}`))).pipe(
          map(userData => (userData.data() as UserData)?.isAdmin || false),
          catchError(() => of(false))
        );
      })
    );
  }

  // Helper method for synchronous admin check
  isAdminSync(email: string | null): boolean {
    if (!email) return false;
    return this.adminEmails.includes(email);
  }

  getCurrentUserId(): Observable<string | null> {
    return this.user$.pipe(
      map(user => user?.uid || null)
    );
  }

  getUserEmail(): Observable<string | null> {
    return this.user$.pipe(
      map(user => user?.email || null)
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
