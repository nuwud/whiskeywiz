import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Observable, from, throwError, of } from 'rxjs';
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

  // Auth State
  getAuthState(): Observable<any> {
    return this.auth.authState;
  }

  // Game Progress Methods (consolidated)
  getGameProgress(authId: string): Observable<GameState> {
    return this.gameProgressCollection.doc(authId).valueChanges()
      .pipe(
        map(state => {
          if (!state) throw new Error('Game progress not found');
          return state;
        }),
        catchError(error => {
          console.error('Error fetching game progress:', error);
          return throwError(() => new Error(`Failed to fetch game progress: ${error.message}`));
        })
      );
  }

  setGameProgress(authId: string, gameState: GameState): Observable<void> {
    return from(this.gameProgressCollection.doc(authId).set(gameState))
      .pipe(
        tap(() => console.log('Game progress saved successfully')),
        catchError(error => {
          console.error('Error saving game progress:', error);
          return throwError(() => new Error(`Failed to save game progress: ${error.message}`));
        })
      );
  }

  updateGameProgress(authId: string, gameState: Partial<GameState>): Observable<void> {
    return from(this.gameProgressCollection.doc(authId).update(gameState))
      .pipe(
        tap(() => console.log('Game progress updated successfully')),
        catchError(error => {
          console.error('Error updating game progress:', error);
          return throwError(() => new Error(`Failed to update game progress: ${error.message}`));
        })
      );
  }

  deleteGameProgress(authId: string): Observable<void> {
    return from(this.gameProgressCollection.doc(authId).delete())
      .pipe(
        tap(() => console.log('Game progress deleted successfully')),
        catchError(error => {
          console.error('Error deleting game progress:', error);
          return throwError(() => new Error(`Failed to delete game progress: ${error.message}`));
        })
      );
  }

  // Removed duplicate gameProgress methods
  // Removed gameProgressBatch methods as they're no longer needed
  // Removed gameState methods as they're duplicates

  // Rest of the service remains unchanged for now
  // Will be updated in subsequent commits
}