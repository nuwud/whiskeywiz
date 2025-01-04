import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection, query, where, getDocs, writeBatch, getDoc } from '@angular/fire/firestore';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, catchError, tap, take } from 'rxjs/operators';

interface UserData {
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly shopifyConfig = environment.shopify;
  private readonly adminEmails = ['nuwudorder@gmail.com', 'bobby@blindbarrels.com'];
  
  private currentUser = new BehaviorSubject<User | null>(null);
  private userRoles = new BehaviorSubject<{ isAdmin: boolean; isGuest: boolean; }>({ 
    isAdmin: false, 
    isGuest: true 
  });

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    // Initialize auth state
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUser.next(user);
      if (user) {
        const roles = await this.loadUserRoles(user);
        this.userRoles.next(roles);
      } else {
        const guestId = localStorage.getItem('guestId');
        this.userRoles.next({ isAdmin: false, isGuest: !!guestId });
      }
    });
  }

  get user$(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  get roles$(): Observable<{ isAdmin: boolean; isGuest: boolean; }> {
    return this.userRoles.asObservable();
  }

  createGuestSession(): Observable<string> {
    return of(this.generateGuestId()).pipe(
      tap(guestId => {
        localStorage.setItem('guestId', guestId);
        this.userRoles.next({ isAdmin: false, isGuest: true });
      })
    );
  }

  private generateGuestId(): string {
    return 'guest_' + Math.random().toString(36).substr(2, 9);
  }

  getPlayerId(): Observable<string> {
    return this.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) return of(user.uid);
        const guestId = localStorage.getItem('guestId');
        if (guestId) return of(guestId);
        return this.createGuestSession();
      })
    );
  }

  private async loadUserRoles(user: User) {
    if (!user) return { isAdmin: false, isGuest: true };
    
    try {
      const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
      const userData = userDoc.data() as UserData;
      
      return {
        isAdmin: userData?.isAdmin || this.adminEmails.includes(user.email || ''),
        isGuest: false
      };
    } catch (error) {
      console.error('Error loading user roles:', error);
      return { isAdmin: false, isGuest: false };
    }
  }

  // Authentication methods
  async signIn(email: string, password: string) {
    try {
      console.log('Attempting sign in...', { email });
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      
      if (result.user) {
        const isAdmin = this.adminEmails.includes(email);
        await setDoc(doc(this.firestore, `users/${result.user.uid}`), {
          email: result.user.email,
          isAdmin,
          lastLogin: new Date()
        }, { merge: true });
        
        this.userRoles.next({ isAdmin, isGuest: false });
      }
      
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
  
      const isAdmin = this.adminEmails.includes(email);
      await setDoc(doc(this.firestore, `users/${credential.user.uid}`), {
        email: credential.user.email,
        isAdmin,
        createdAt: new Date(),
        isGuest: false
      }, { merge: true });

      this.userRoles.next({ isAdmin, isGuest: false });
      console.log('Registration successful:', credential.user.uid);
      return credential.user;
  
    } catch (error: any) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  async signOut() {
    await signOut(this.auth);
    localStorage.removeItem('guestId');
    localStorage.removeItem('playerName');
    this.userRoles.next({ isAdmin: false, isGuest: false });
  }

  // Auth state checks
  isAuthenticated(): Observable<boolean> {
    return this.roles$.pipe(
      map(roles => !roles.isGuest || !!localStorage.getItem('guestId')),
      catchError(() => of(false))
    );
  }

  isAdmin(): Observable<boolean> {
    return this.roles$.pipe(
      map(roles => roles.isAdmin),
      catchError(() => of(false))
    );
  }

  // Helper method for synchronous admin check
  isAdminSync(email: string | null): boolean {
    if (!email) return false;
    return this.adminEmails.includes(email);
  }

  getCurrentUserId(): Observable<string | null> {
    return this.user$.pipe(
      map(user => user?.uid || localStorage.getItem('guestId'))
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