// auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { switchMap as rxjsSwitchMap } from 'rxjs/operators';

interface UserData {
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.user$ = new Observable((subscriber) => {
      return auth.onAuthStateChanged(subscriber);
    });
  }

  // Sign in method
  async signIn(email: string, password: string) {
    try {
      console.log('Attempting sign in...', { email });
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Sign in successful', result);
      return result;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Register method
  async register(email: string, password: string): Promise<User> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (credential.user) {
        // Create user document in Firestore
        await setDoc(doc(this.firestore, `users/${credential.user.uid}`), {
          email: credential.user.email,
          isAdmin: false,
          createdAt: new Date()
        });
        return credential.user;
      }
      throw new Error('User creation failed');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out method
  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Authentication check
  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user),
      catchError(() => of(false))
    );
  }

  // Admin check
  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      switchMap(async (user) => {
        if (!user) return of(false);
        const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
        const userData = userDoc.data() as UserData;
        return of(userData?.isAdmin || false);
      }),
      catchError(() => of(false))
    );
  }

  // Get current user ID
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
      default:
        message = error.message || message;
    }

    return new Error(message);
  }
}
function switchMap<T, R>(project: (value: T, index: number) => Promise<Observable<R>>): import("rxjs").OperatorFunction<T, R> {
  return rxjsSwitchMap((value, index) => from(project(value, index)).pipe(rxjsSwitchMap(innerObservable => innerObservable)));
}
