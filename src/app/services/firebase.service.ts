import { Injectable, Inject } from '@angular/core';
import { 
  Firestore, CollectionReference, collection, 
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, getDocs
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Analytics } from '@angular/fire/analytics';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Quarter } from '../shared/models/quarter.model';
import { GameState, QuarterInfo } from '../shared/models/game.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private quartersRef: CollectionReference;
  private gameStatesRef: CollectionReference;
  private scoresRef: CollectionReference;
  private initialized = true;

  constructor(
    @Inject('FIREBASE_FIRESTORE') private firestore: Firestore,
    private router: Router,
    @Inject('FIREBASE_ANALYTICS') private analytics: Analytics,
    private authService: AuthService
  ) {
    try {
      this.quartersRef = collection(this.firestore, 'quarters');
      this.gameStatesRef = collection(this.firestore, 'gameStates');
      this.scoresRef = collection(this.firestore, 'scores');
    } catch (error) {
      this.initialized = false;
      this.router.navigate(['/']);
      throw error;
    }
  }

  getQuarters(): Observable<Quarter[]> {
    return from(
      getDocs(collection(this.firestore, 'quarters')).then(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Quarter))
      )
    );
  }

  getQuarterById(id: number): Observable<Quarter[]> {
    return from(
      getDocs(query(this.quartersRef, where('id', '==', id))).then(snapshot =>
          snapshot.docs.map(doc => ({
          id: doc.id,
        ...doc.data()
        } as Quarter))
      )
    );
  }

  saveScore(
    scoreOrPlayerId: { score: number, timestamp?: number } | string, 
    quarterId?: string, 
    score?: number
  ): Observable<void> {
    return this.authService.getCurrentUserId().pipe(
      switchMap(userId => {
        // Determine playerId
        const defaultPlayerId = 'guest_' + Date.now();
        const playerId = userId || defaultPlayerId;
        
        let finalScore: number;
        let finalQuarterId: string;
        let timestamp: number;

        // Handle object input
        if (typeof scoreOrPlayerId === 'object') {
          finalScore = scoreOrPlayerId.score;
          timestamp = scoreOrPlayerId.timestamp || Date.now();
          finalQuarterId = quarterId || 'unknown';
        } 
        // Handle separate arguments
        else {
          finalScore = score || 0;
          finalQuarterId = quarterId || 'unknown';
          timestamp = Date.now();
        }

        const scoreDocId = `${playerId}_${finalQuarterId}`;
        return from(setDoc(doc(this.scoresRef, scoreDocId), {
          playerId,
          quarterId: finalQuarterId,
          score: finalScore,
          timestamp
        }));
      }),
      catchError(error => {
        console.error('Error saving score:', error);
        return throwError(() => error);
      })
    );
  }
  getQuarterStats = (): Observable<Quarter[]> => {
    return this.authService.getCurrentUserId().pipe(
      switchMap(userId => {
        const queryRef = query(
          this.scoresRef,
          where('playerId', '==', userId || 'guest_' + Date.now())
        );
        return from(getDocs(queryRef));
      }),
      map(snapshot => snapshot.docs.map(doc => doc.data() as Quarter)),
      catchError(error => {
        console.error('Error fetching quarter stats:', error);
        return throwError(() => error);
        })
    );
  }
  getPlayerStats = (): Observable<Quarter[]> => {
    return this.authService.getCurrentUserId().pipe(
      switchMap(userId => {
        const queryRef = query(
          this.scoresRef,
          where('playerId', '==', userId || 'guest_' + Date.now())
        );
        return from(getDocs(queryRef));
      }),
      map(snapshot => snapshot.docs.map(doc => doc.data() as Quarter)),
      catchError(error => {
        console.error('Error fetching player stats:', error);
        return throwError(() => error);
      })
    );
  }
}