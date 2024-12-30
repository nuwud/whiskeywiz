import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Observable, from, throwError, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { Quarter, PlayerScore, ScoringRules, GameState, isValidQuarter } from '../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly quartersCollection: AngularFirestoreCollection<Quarter>;
  private readonly scoresCollection: AngularFirestoreCollection<PlayerScore>;
  private readonly scoringRulesDoc: AngularFirestoreDocument<ScoringRules>;
  private readonly gameProgressCollection: AngularFirestoreCollection<GameState>;
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly auth: AngularFireAuth,
    private readonly storage: AngularFireStorage,
    private readonly database: AngularFireDatabase,
    private readonly functions: AngularFireFunctions,
    private readonly analytics: AngularFireAnalytics
  ) {
    this.quartersCollection = this.firestore.collection<Quarter>('quarters');
    this.scoresCollection = this.firestore.collection<PlayerScore>('scores');
    this.scoringRulesDoc = this.firestore.doc<ScoringRules>('config/scoringRules');
    this.gameProgressCollection = this.firestore.collection<GameState>('gameProgress');
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

  // Auth State
  getAuthState(): Observable<any> {
    return this.auth.authState.pipe(
      catchError(error => this.handleError('getAuthState', error))
    );
  }

  // Game Progress - Consolidated Methods
  getGameProgress(authId: string): Observable<GameState> {
    return this.gameProgressCollection.doc(authId).valueChanges().pipe(
      map(state => {
        if (!state) throw new Error('Game progress not found');
        return state;
      }),
      catchError(error => this.handleError('getGameProgress', error))
    );
  }

  setGameProgress(authId: string, gameState: GameState): Observable<void> {
    return from(this.gameProgressCollection.doc(authId).set(gameState)).pipe(
      catchError(error => this.handleError('setGameProgress', error))
    );
  }

  updateGameProgress(authId: string, updates: Partial<GameState>): Observable<void> {
    return from(this.gameProgressCollection.doc(authId).update(updates)).pipe(
      catchError(error => this.handleError('updateGameProgress', error))
    );
  }

  deleteGameProgress(authId: string): Observable<void> {
    return from(this.gameProgressCollection.doc(authId).delete()).pipe(
      catchError(error => this.handleError('deleteGameProgress', error))
    );
  }

  // Quarter Management
  getQuarters(): Observable<Quarter[]> {
    return this.quartersCollection.valueChanges({ idField: 'id' }).pipe(
      map(quarters => quarters.filter(isValidQuarter)),
      tap(quarters => console.log('Valid quarters fetched:', quarters.length)),
      catchError(error => this.handleError('getQuarters', error))
    );
  }

  getQuarterById(id: string): Observable<Quarter | null> {
    return this.quartersCollection.doc<Quarter>(id)
      .get({ source: 'server' })
      .pipe(
        map(doc => {
          if (!doc.exists) return null;
          const data = doc.data() as Quarter;
          const result = {
            ...data,
            id: doc.id,
            samples: data.samples || {}
          };
          if (!isValidQuarter(result)) {
            throw new Error('Invalid quarter data structure');
          }
          return result;
        }),
        catchError(error => this.handleError('getQuarterById', error))
      );
  }

  updateQuarter(quarterId: string, quarterData: Partial<Quarter>): Observable<void> {
    const docRef = this.quartersCollection.doc(quarterId);
    
    return docRef.get().pipe(
      switchMap(doc => {
        if (!doc.exists) {
          throw new Error(`Quarter ${quarterId} does not exist`);
        }
        const currentData = doc.data() as Quarter;
        const updatedData = { ...currentData, ...quarterData };
        
        if (!isValidQuarter(updatedData)) {
          throw new Error('Update would result in invalid quarter data');
        }
        
        return from(docRef.update(quarterData));
      }),
      catchError(error => this.handleError('updateQuarter', error))
    );
  }

  // Score Management
  submitScore(score: PlayerScore): Observable<void> {
    const scoreWithTimestamp = {
      ...score,
      timestamp: new Date(),
      playerId: score.playerId || 'guest',
      playerName: score.playerName || 'Guest Player'
    };
    
    return from(this.scoresCollection.add(scoreWithTimestamp)).pipe(
      map(() => undefined),
      catchError(error => this.handleError('submitScore', error))
    );
  }

  getLeaderboard(quarterId: string): Observable<PlayerScore[]> {
    return this.firestore
      .collection<PlayerScore>('scores', ref => 
        ref.where('quarterId', '==', quarterId)
           .orderBy('score', 'desc')
           .limit(10)
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError(error => this.handleError('getLeaderboard', error))
      );
  }

  // Scoring Rules
  updateScoringRules(rules: ScoringRules): Observable<void> {
    return from(this.scoringRulesDoc.set(rules)).pipe(
      catchError(error => this.handleError('updateScoringRules', error))
    );
  }

  getScoringRules(): Observable<ScoringRules> {
    return this.scoringRulesDoc.valueChanges().pipe(
      map(rules => {
        if (!rules) throw new Error('No scoring rules found');
        return rules;
      }),
      catchError(error => this.handleError('getScoringRules', error))
    );
  }

  // File Management
  uploadFile(path: string, file: File): Observable<string> {
    return from(this.storage.upload(path, file)).pipe(
      switchMap(snapshot => snapshot.ref.getDownloadURL()),
      catchError(error => this.handleError('uploadFile', error))
    );
  }

  // Analytics
  logEvent(eventName: string, eventParams: Record<string, any>): void {
    try {
      this.analytics.logEvent(eventName, eventParams);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
}