import { Injectable } from '@angular/core';
import { Observable, from, throwError, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Quarter, PlayerScore, ScoringRules, GameState } from '../shared/models/quarter.model';

// Import Firebase instances from initialization file
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
  CollectionReference 
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

  constructor() {
    this.quartersRef = collection(firestore, 'quarters');
    this.scoresRef = collection(firestore, 'scores');
    this.scoringRulesRef = doc(firestore, 'config/scoringRules');
    this.customEventsRef = collection(firestore, 'customEvents');
  }

  getAuthState(): Observable<any> {
    return new Observable(observer => {
      return auth.onAuthStateChanged(
        user => observer.next(user),
        error => observer.error(error),
        () => observer.complete()
      );
    });
  }

  gameProgress(authId: string): Observable<GameState> {
    return from(getDoc(doc(firestore, 'gameProgress', authId)))
      .pipe(map(doc => doc.data() as GameState));
  }

  async updateQuarter(quarterId: string, quarterData: Partial<Quarter>): Promise<void> {
    console.log('Attempting to update quarter:', { quarterId, quarterData });
    const quarterRef = doc(this.quartersRef, quarterId);
    
    try {
      const docSnap = await getDoc(quarterRef);
      if (!docSnap.exists()) {
        throw new Error(`Quarter document ${quarterId} does not exist`);
      }
      
      await updateDoc(quarterRef, quarterData);
      console.log('Quarter update successful');
    } catch (error) {
      console.error('Quarter update failed:', error);
      throw error;
    }
  }

  async updateQuarterAndScores(
    quarterId: string, 
    quarterData: Partial<Quarter>,
    scores: PlayerScore[]
  ): Promise<void> {
    const batch = writeBatch(firestore);
    
    // Update quarter
    const quarterRef = doc(this.quartersRef, quarterId);
    batch.update(quarterRef, quarterData);
    
    // Update scores
    scores.forEach(score => {
      const scoreRef = doc(this.scoresRef, score.id);
      batch.set(scoreRef, score, { merge: true });
    });
    
    await batch.commit();
  }

  getQuarters(): Observable<Quarter[]> {
    return from(getDocs(this.quartersRef)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quarter))
      ),
      tap(quarters => console.log('Fetched quarters:', quarters))
    );
  }

  getQuarterById(id: string): Observable<Quarter | null> {
    console.log(`Fetching quarter ${id} from Firestore`);
    return from(getDoc(doc(this.quartersRef, id))).pipe(
      map(doc => {
        if (doc.exists()) {
          return { id: doc.id, ...doc.data() } as Quarter;
        }
        return null;
      }),
      catchError(error => {
        console.error(`Error fetching quarter ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  getActiveQuarters(): Observable<string[]> {
    const activeQuery = query(
      this.quartersRef,
      where('active', '==', true),
      orderBy('name', 'desc')
    );

    return from(getDocs(activeQuery)).pipe(
      map(snapshot => snapshot.docs.map(doc => doc.id)),
      catchError(error => {
        console.error('Error fetching active quarters:', error);
        return of([]);
      })
    );
  }

  async submitScore(score: PlayerScore): Promise<void> {
    console.log('Submitting score:', score);
    const scoreWithTimestamp = {
      ...score,
      timestamp: serverTimestamp(),
      playerId: score.playerId || 'guest',
      playerName: score.playerName || 'Guest Player'
    };
    
    try {
      await setDoc(doc(this.scoresRef), scoreWithTimestamp);
      console.log('Score submitted successfully');
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  }

  getLeaderboard(quarterId: string): Observable<PlayerScore[]> {
    console.log('Getting leaderboard for quarter:', quarterId);
    const leaderboardQuery = query(
      this.scoresRef,
      where('quarterId', '==', quarterId),
      orderBy('score', 'desc'),
      limit(10)
    );

    return from(getDocs(leaderboardQuery)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlayerScore))
      ),
      tap(scores => {
        console.log('Fetched scores:', scores);
        if (scores.length === 0) {
          console.log('No scores found for quarter:', quarterId);
        }
      }),
      catchError(error => {
        console.error('Error fetching leaderboard:', error);
        return throwError(() => error);
      })
    );
  }

  // Helper function for uploading files to storage
  async uploadFile(path: string, file: File): Promise<string> {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  }

  // Helper function for database operations
  async getDatabaseValue(path: string): Promise<any> {
    const dbRef = databaseRef(database, path);
    const snapshot = await getDatabaseRef(dbRef);
    return snapshot.val();
  }

  // Helper function for calling Firebase Functions
  callFunction(name: string, data: any): Promise<any> {
    const func = httpsCallable(functions, name);
    return func(data);
  }

  // Helper function for logging analytics events
  logAnalyticsEvent(eventName: string, eventParams: any): void {
    logEvent(analytics, eventName, eventParams);
  }

  // Game state operations
  async saveGameProgress(authId: string, gameState: GameState): Promise<void> {
    const progressRef = doc(firestore, 'gameProgress', authId);
    await setDoc(progressRef, gameState);
  }
}
