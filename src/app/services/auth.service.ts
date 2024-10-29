// auth.service.ts
import { Injectable } from '@angular/core';
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
  private readonly adminEmails = ['nuwudorder@gmail.com']; // Add second admin email when ready

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