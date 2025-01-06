import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable, from, of, BehaviorSubject, interval, defer } from 'rxjs';
import { map, switchMap, catchError, tap, take, startWith } from 'rxjs/operators';

interface UserData {
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

interface GuestSession {
  id: string;
  created: number;
  expires: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly shopifyConfig = environment.shopify;
  private readonly adminEmails = ['nuwudorder@gmail.com', 'bobby@blindbarrels.com'];
  private readonly GUEST_SESSION_KEY = 'guestSession';
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  
  private currentUser = new BehaviorSubject<User | null>(null);
  private userRoles = new BehaviorSubject<{ isAdmin: boolean; isGuest: boolean; }>({ 
    isAdmin: false, 
    isGuest: true 
  });

  redirectUrl: string | null = null;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.initializeAuth();
  }

  private async initializeAuth() {
    await setPersistence(this.auth, browserLocalPersistence);
    this.setupAuthStateChange();
    this.setupTokenRefresh();
    this.recoverAuthState();
  }

  private setupAuthStateChange() {
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUser.next(user);
      if (user) {
        const roles = await this.loadUserRoles(user).toPromise();
        this.userRoles.next(roles);
        this.saveAuthState(roles);
      } else {
        await this.handleGuestSession().toPromise();
      }
    });
  }

  private setupTokenRefresh() {
    this.user$.pipe(
      switchMap(user => {
        if (!user) return of(null);
        return interval(10 * 60 * 1000).pipe(
          startWith(0),
          switchMap(() => from(user.getIdToken(true)))
        );
      })
    ).subscribe();
  }

  private recoverAuthState() {
    const stored = localStorage.getItem('authState');
    if (stored) {
      try {
        const state = JSON.parse(stored);
        this.userRoles.next(state);
      } catch (e) {
        localStorage.removeItem('authState');
      }
    }
  }

  private saveAuthState(state: { isAdmin: boolean; isGuest: boolean }) {
    localStorage.setItem('authState', JSON.stringify(state));
  }

  private handleGuestSession(): Observable<string> {
    return defer(() => {
      const stored = localStorage.getItem(this.GUEST_SESSION_KEY);
      if (stored) {
        const session: GuestSession = JSON.parse(stored);
        if (session.expires > Date.now()) {
          this.userRoles.next({ isAdmin: false, isGuest: true });
          return of(session.id);
        }
      }
      return this.createGuestSession();
    });
  }

  [... rest of the auth methods remain the same ...]
}