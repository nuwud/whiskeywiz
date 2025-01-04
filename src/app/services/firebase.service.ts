import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  DocumentReference,
  CollectionReference,
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  collectionData,
  docData,
  DocumentData,
  query,
  where,
  orderBy,
  limit
} from '@angular/fire/firestore';
import { ScoringRules } from '../shared/models/scoring.model';
import { PlayerScore, Quarter } from '../shared/models/quarter.model';
import { QuarterStats, PlayerStats } from '../shared/models/analytics.model';
import { Observable, from, throwError } from 'rxjs';
import { GameState } from '../shared/models/game.model';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private scoringRulesRef: DocumentReference;
  private scoresRef: CollectionReference;
  private quartersRef: CollectionReference;
  private gameStatesRef: CollectionReference;
  private initialized = false;

  constructor(private firestore: Firestore, private router: Router) {
    try {
      this.scoringRulesRef = doc(this.firestore, 'config/scoringRules');
      this.scoresRef = collection(this.firestore, 'scores');
      this.quartersRef = collection(this.firestore, 'quarters');
      this.gameStatesRef = collection(this.firestore, 'gameStates');
      this.initialized = true;
      console.log('Firebase service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase service:', error);
      this.router.navigate(['/']);
    }
  }

  private ensureInitialized() {
    if (!this.initialized) {
      throw new Error('Firebase service not properly initialized');
    }
  }

  // Quarter Management
  getQuarters(): Observable<Quarter[]> {
    this.ensureInitialized();
    return collectionData(this.quartersRef, { idField: 'id' }).pipe(
      map(quarters => this.validateQuarters(quarters as Quarter[])),
      tap(quarters => console.log(`Retrieved ${quarters.length} quarters`)),
      catchError(error => {
        console.error('Error fetching quarters:', error);
        return throwError(() => error);
      })
    );
  }

  getQuarterById(mmyy: string): Observable<Quarter | null> {
    this.ensureInitialized();
    const quarterRef = doc(this.quartersRef, mmyy);
    return docData(quarterRef, { idField: 'id' }).pipe(
      map(quarter => this.validateQuarter(quarter as Quarter)),
      tap(quarter => console.log(`Retrieved quarter ${mmyy}:`, quarter)),
      catchError(error => {
        console.error(`Error fetching quarter ${mmyy}:`, error);
        return throwError(() => error);
      })
    );
  }

  async saveQuarter(quarter: Quarter): Promise<void> {
    this.ensureInitialized();
    if (!this.isValidMMYY(quarter.id)) {
      throw new Error('Invalid quarter ID format');
    }

    try {
      const quarterRef = doc(this.quartersRef, quarter.id);
      await setDoc(quarterRef, {
        ...quarter,
        updatedAt: serverTimestamp()
      });
      console.log(`Saved quarter ${quarter.id}`);
    } catch (error) {
      console.error(`Error saving quarter ${quarter.id}:`, error);
      throw error;
    }
  }

  // Game State Management
  saveGameProgress(playerId: string, state: GameState): Observable<void> {
    this.ensureInitialized();
    const stateRef = doc(this.gameStatesRef, `${playerId}_${state.id}`);
    return from(setDoc(stateRef, {
      ...state,
      playerId,
      updatedAt: serverTimestamp()
    })).pipe(
      tap(() => console.log(`Saved game state for player ${playerId} in quarter ${state.id}`)),
      catchError(error => {
        console.error('Error saving game state:', error);
        return throwError(() => error);
      })
    );
  }

  getPlayerGameState(playerId: string, quarterId: string): Observable<GameState | null> {
    this.ensureInitialized();
    const stateRef = doc(this.gameStatesRef, `${playerId}_${quarterId}`);
    return docData(stateRef).pipe(
      map(state => state as GameState || null),
      tap(state => console.log(`Retrieved game state for player ${playerId} in quarter ${quarterId}:`, state)),
      catchError(error => {
        console.error('Error fetching game state:', error);
        return throwError(() => error);
      })
    );
  }

  // Score Management
  saveScore(score: PlayerScore): Observable<void> {
    this.ensureInitialized();
    return from(setDoc(doc(this.scoresRef), {
      ...score,
      timestamp: serverTimestamp()
    })).pipe(
      tap(() => console.log(`Saved score for player ${score.playerId} in quarter ${score.quarterId}`)),
      catchError(error => {
        console.error('Error saving score:', error);
        return throwError(() => error);
      })
    );
  }

  getQuarterScores(quarterId: string): Observable<PlayerScore[]> {
    this.ensureInitialized();
    const scoresQuery = query(
      this.scoresRef,
      where('quarterId', '==', quarterId),
      orderBy('score', 'desc'),
      limit(100)
    );

    return collectionData(scoresQuery, { idField: 'id' }).pipe(
      map(scores => scores as PlayerScore[]),
      tap(scores => console.log(`Retrieved ${scores.length} scores for quarter ${quarterId}`)),
      catchError(error => {
        console.error('Error fetching scores:', error);
        return throwError(() => error);
      })
    );
  }

  // Utility Methods
  private validateQuarters(quarters: Quarter[]): Quarter[] {
    return quarters.filter(quarter => this.validateQuarter(quarter));
  }

  private validateQuarter(quarter: Quarter | null): Quarter | null {
    if (!quarter || !this.isValidMMYY(quarter.id)) {
      console.warn('Invalid quarter:', quarter);
      return null;
    }
    return quarter;
  }

  private isValidMMYY(mmyy: string): boolean {
    if (!mmyy || mmyy.length !== 4) return false;
    const month = parseInt(mmyy.substring(0, 2));
    const year = parseInt(mmyy.substring(2, 4));
    return month >= 1 && month <= 12 && year >= 20 && year <= 99;
  }
}