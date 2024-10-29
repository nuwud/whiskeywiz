// auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

// Define the user interface with all possible properties
export interface User {
  uid: string;
  email: string | null;
  roles?: string[];
  isAdmin?: boolean;
  displayName?: string | null;
  createdAt?: Date;
}

// Define the Firestore user data interface
interface UserData {
  email: string | null;
  isAdmin: boolean;
  roles?: string[];
  displayName?: string | null;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }
        // Get additional user data from Firestore
        return this.firestore.doc<UserData>(`users/${user.uid}`).valueChanges().pipe(
          map(userData => {
            if (!userData) {
              return {
                uid: user.uid,
                email: user.email,
                isAdmin: false,
                roles: []
              };
            }
            return {
              uid: user.uid,
              email: user.email,
              isAdmin: userData.isAdmin || false,
              roles: userData.roles || [],
              displayName: user.displayName || userData.displayName,
              createdAt: userData.createdAt
            };
          })
        );
      }),
      catchError(error => {
        console.error('Error in user stream:', error);
        return of(null);
      })
    );
  }

  async register(email: string, password: string): Promise<User | null> {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (credential.user) {
        const userData: UserData = {
          email: credential.user.email,
          isAdmin: false,
          roles: ['player'], // Default role
          createdAt: new Date()
        };

        await this.firestore.doc(`users/${credential.user.uid}`).set(userData);
        
        return {
          uid: credential.user.uid,
          email: credential.user.email,
          isAdmin: false,
          roles: ['player']
        };
      }
      return null;
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (!credential.user) return null;
      
      const userDoc = await this.firestore
        .doc<UserData>(`users/${credential.user.uid}`)
        .get()
        .toPromise();

      const userData = userDoc?.data();
      return userData ? {
        uid: credential.user.uid,
        email: credential.user.email,
        isAdmin: userData.isAdmin || false,
        roles: userData.roles || [],
        displayName: credential.user.displayName || userData.displayName
      } : null;
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw this.handleAuthError(error);
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user),
      catchError(() => of(false))
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.user$.pipe(take(1));
  }

  getCurrentUserId(): Observable<string | null> {
    return this.user$.pipe(
      map(user => user?.uid || null),
      take(1)
    );
  }

  hasRole(role: string): Observable<boolean> {
    return this.user$.pipe(
      map(user => user?.roles?.includes(role) || false),
      catchError(() => of(false))
    );
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      map(user => user?.isAdmin || false),
      catchError(() => of(false))
    );
  }

  private handleAuthError(error: any): Error {
    let message = 'An authentication error occurred';
    
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'No user found with this email address';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password';
          break;
        case 'auth/email-already-in-use':
          message = 'This email address is already registered';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address';
          break;
        case 'auth/weak-password':
          message = 'Password is too weak';
          break;
        default:
          message = error.message || message;
      }
    }

    return new Error(message);
  }
}