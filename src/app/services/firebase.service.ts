import { Injectable, Inject } from '@angular/core';
import { 
  Firestore, CollectionReference, collection, 
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, getDocs
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Analytics } from '@angular/fire/analytics';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Quarter } from '../shared/models/quarter.model';
import { GameState, QuarterInfo } from '../shared/models/game.model';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private quartersRef: CollectionReference;
  private gameStatesRef: CollectionReference;
  private initialized = true;

  constructor(
    @Inject('FIREBASE_FIRESTORE') private firestore: Firestore,
    private router: Router,
    @Inject('FIREBASE_ANALYTICS') private analytics: Analytics
  ) {
    try {
      this.quartersRef = collection(this.firestore, 'quarters');
      this.gameStatesRef = collection(this.firestore, 'gameStates');
    } catch (error) {
      this.initialized = false;
      this.router.navigate(['/']);
      throw error;
    }
  }

  private isValidMMYY(quarterId: string): boolean {
    if (!quarterId || quarterId.length !== 4) return false;
    
    const month = parseInt(quarterId.substring(0, 2), 10);
    const year = parseInt(quarterId.substring(2, 4), 10);

    return month >= 1 && month <= 12 && year >= 22 && year <= 99;
  }

  getQuarters(): Observable<QuarterInfo[]> {
    if (!this.initialized) {
      return throwError(() => new Error('Firebase service not properly initialized'));
    }

    return from(getDocs(this.quartersRef)).pipe(
      map(snapshot => snapshot.docs
        .map(doc => ({ id: doc.id, ...(doc.data() as object) } as QuarterInfo))
        .filter(quarter => this.isValidMMYY(quarter.id))
      ),
      catchError(error => {
        console.error('Error fetching quarters:', error);
        return of([]);
      })
    );
  }

  saveGameProgress(playerId: string, gameState: GameState): Observable<void> {
    const gameStateId = `${playerId}_${gameState.quarterId}`;
    return from(setDoc(doc(this.gameStatesRef, gameStateId), gameState)).pipe(
      catchError(error => {
        console.error('Error saving game progress:', error);
        return throwError(() => error);
      })
    );
  }

  logEvent(eventName: string, params?: Record<string, any>) {
    this.analytics.logEvent(eventName, params);
  }
}