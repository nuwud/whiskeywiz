import { Injectable } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userRoles = new BehaviorSubject<{ isAdmin: boolean; isGuest: boolean; }>({
    isAdmin: false,
    isGuest: false
  });

  private readonly user$ = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    auth.onAuthStateChanged(user => {
      this.user$.next(user);
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user)
    );
  }

  isAdmin(): Observable<boolean> {
    return this.userRoles.pipe(
      map(roles => roles.isAdmin)
    );
  }

  getCurrentUserId(): Observable<string | null> {
    return this.user$.pipe(
      map(user => user?.uid || null)
    );
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async register(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  createGuestSession(): Observable<string> {
    const guestId = `guest_${Date.now()}`;
    this.userRoles.next({ ...this.userRoles.value, isGuest: true });
    return of(guestId);
  }

  async transferGuestScores(guestId: string, userId: string): Promise<void> {
    // Implement transfer logic
    console.log(`Transferring scores from ${guestId} to ${userId}`);
  }
}
