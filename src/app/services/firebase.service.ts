import { Injectable } from '@angular/core';
import { Observable, from, throwError, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, tap, catchError, retry } from 'rxjs/operators';
import { Quarter, PlayerScore, ScoringRules, GameState } from '../shared/models/quarter.model';

// Import Firebase instances
import { 
  firestore, 
  auth, 
  storage, 
  database, 
  functions, 
  analytics 
} from '../../firebase.init';

// Import Firebase types
import { 
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
  DocumentReference,
  CollectionReference,
  Firestore
} from 'firebase/firestore';

import { 
  uploadBytes,
  getDownloadURL,
  ref as storageRef 
} from 'firebase/storage';

import { 
  ref as databaseRef,
  get as getDatabaseRef,
  set as setDatabaseRef 
} from 'firebase/database';

import { 
  httpsCallable 
} from 'firebase/functions';

import { 
  logEvent 
} from 'firebase/analytics';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private quartersRef: CollectionReference;
  private scoresRef: CollectionReference;
  private scoringRulesRef: DocumentReference;
  private customEventsRef: CollectionReference;
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    this.quartersRef = collection(firestore, 'quarters');
    this.scoresRef = collection(firestore, 'scores');
    this.scoringRulesRef = doc(firestore, 'config/scoringRules');
    this.customEventsRef = collection(firestore, 'customEvents');
  }

  // Error handling
  get errors$(): Observable<string | null> {
    return this.errorSubject.asObservable();
  }

  private handleError(operation: string, error: any): Observable<never> {
    console.error(`${operation} failed:`, error);
    this.errorSubject.next(`Operation ${operation} failed: ${error.message}`);
    return throwError(() => error);
  }

  // Authentication
  getAuthState(): Observable<any> {
    return new Observable(observer => {
      return auth.onAuthStateChanged(
        user => observer.next(user),
        error => observer.error(error),
        () => observer.complete()
      );
    }).pipe(
      retry(3),
      catchError(error => this.handleError('getAuthState', error))
    );
  }

  // Game Progress
  gameProgress(authId: string): Observable<GameState> {
    return from(getDoc(doc(firestore, 'gameProgress', authId))).pipe(
      map(doc => doc.data() as GameState),
      catchError(error => this.handleError('gameProgress', error))
    );
  }

  gameProgressSet(authId: string, state: GameState): Observable<void> {
    return from(setDoc(doc(firestore, 'gameProgress', authId), state)).pipe(
      catchError(error => this.handleError('gameProgressSet', error))
    );
  }

  // Quarters
  getQuarters(): Observable<Quarter[]> {
    return from(getDocs(this.quartersRef)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quarter))
      ),
      tap(quarters => console.log('Fetched quarters:', quarters)),
      catchError(error => this.handleError('getQuarters', error))
    );
  }

  getQuarterById(id: string): Observable<Quarter | null> {
    return from(getDoc(doc(this.quartersRef, id))).pipe(
      map(doc => {
        if (!doc.exists()) return null;
        return { id: doc.id, ...doc.data() } as Quarter;
      }),
      catchError(error => this.handleError('getQuarterById', error))
    );
  }

  // Scoring Rules
  getScoringRules(): Observable<ScoringRules> {
    return from(getDoc(this.scoringRulesRef)).pipe(
      map(doc => {
        const data = doc.data();
        if (!data) throw new Error('No scoring rules found');
        return data as ScoringRules;
      }),
      catchError(error => this.handleError('getScoringRules', error))
    );
  }

  updateScoringRules(rules: ScoringRules): Observable<void> {
    return from(setDoc(this.scoringRulesRef, rules)).pipe(
      catchError(error => this.handleError('updateScoringRules', error))
    );
  }

  // Generic Collection Operations
  getCollection(collectionName: string): Observable<any[]> {
    const collRef = collection(firestore, collectionName);
    return from(getDocs(collRef)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }))),
      catchError(error => this.handleError('getCollection', error))
    );
  }

  getDocument(collectionPath: string, docId: string): Observable<any> {
    const docRef = doc(firestore, collectionPath, docId);
    return from(getDoc(docRef)).pipe(
      map(doc => doc.exists() ? { id: doc.id, ...doc.data() } : null),
      catchError(error => this.handleError('getDocument', error))
    );
  }

  // Score Submission
  submitScore(score: PlayerScore): Observable<void> {
    const scoreWithTimestamp = {
      ...score,
      timestamp: serverTimestamp(),
      playerId: score.playerId || 'guest',
      playerName: score.playerName || 'Guest Player'
    };
    
    return from(setDoc(doc(this.scoresRef), scoreWithTimestamp)).pipe(
      tap(() => console.log('Score submitted successfully')),
      catchError(error => this.handleError('submitScore', error))
    );
  }

  // Utilities
  async uploadFile(path: string, file: File): Promise<string> {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  }

  logAnalyticsEvent(eventName: string, eventParams: any): void {
    try {
      logEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
}
