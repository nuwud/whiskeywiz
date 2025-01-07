import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  CollectionReference,
  DocumentReference
} from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { GameState } from '../shared/models/game.model';
import { PlayerScore, Quarter } from '../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private initialized = false;
  private quartersRef: CollectionReference;
  private gameStatesRef: CollectionReference;
  private scoresRef: CollectionReference;

  constructor(
    private firestore: Firestore,
    private router: Router
  ) {
    try {
      this.quartersRef = collection(this.firestore, 'quarters');
      this.gameStatesRef = collection(this.firestore, 'gameStates');
      this.scoresRef = collection(this.firestore, 'scores');
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing Firebase service:', error);
      this.router.navigate(['/']);
    }
  }

  getQuarters(): Observable<Quarter[]> {
    if (!this.initialized) {
      return throwError(() => new Error('Firebase service not properly initialized'));
    }

    const quarterQuery = query(this.quartersRef, where('active', '==', true));
    return from(getDocs(quarterQuery)).pipe(
      map(snapshot => {
        const quarters: Quarter[] = [];
        snapshot.forEach(doc => {
          quarters.push({ id: doc.id, ...doc.data() } as Quarter);
        });
        return quarters;
      }),
      catchError(error => {
        console.error('Error fetching quarters:', error);
        return throwError(() => new Error('Failed to fetch quarters'));
      })
    );
  }

  getQuarter(quarterId: string): Observable<Quarter | null> {
    if (!this.isValidMMYY(quarterId)) {
      return throwError(() => new Error('Invalid quarter ID format'));
    }

    const quarterRef = doc(this.quartersRef, quarterId);
    return from(getDoc(quarterRef)).pipe(
      map(doc => {
        if (!doc.exists()) return null;
        return { id: doc.id, ...doc.data() } as Quarter;
      }),
      catchError(error => {
        console.error(`Error fetching quarter ${quarterId}:`, error);
        return throwError(() => new Error('Failed to fetch quarter'));
      })
    );
  }

  saveGameProgress(playerId: string, state: GameState): Observable<void> {
    if (!this.initialized) {
      return throwError(() => new Error('Firebase service not properly initialized'));
    }

    const stateRef = doc(this.gameStatesRef, `${playerId}_${state.quarterId}`);
    
    return from(setDoc(stateRef, {
      ...state,
      lastUpdated: Date.now()
    })).pipe(
      tap(() => console.log(`Saved game state for player ${playerId} in quarter ${state.quarterId}`)),
      catchError(error => {
        console.error('Error saving game state:', error);
        return throwError(() => new Error('Failed to save game state'));
      })
    );
  }

  saveScore(score: PlayerScore): Promise<void> {
    if (!this.initialized) {
      return Promise.reject(new Error('Firebase service not properly initialized'));
    }

    const scoreRef = doc(this.scoresRef);
    return setDoc(scoreRef, {
      ...score,
      timestamp: Date.now()
    });
  }

  private isValidMMYY(quarterId: string): boolean {
    if (!quarterId || quarterId.length !== 4) return false;
    
    const month = parseInt(quarterId.slice(0, 2));
    const year = parseInt(quarterId.slice(2));
    
    return month >= 1 && month <= 12;
  }
}