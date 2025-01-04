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
  DocumentData
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

  constructor(private firestore: Firestore, private router: Router) {
    this.scoringRulesRef = doc(this.firestore, 'config/scoringRules');
    this.scoresRef = collection(this.firestore, 'scores');
    this.quartersRef = collection(this.firestore, 'quarters');
  }

  // Collection and Document Access Methods
  getCollection(collectionPath: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionPath);
    return collectionData(collectionRef, { idField: 'id' }).pipe(
      catchError(error => {
        console.error(`Error fetching collection ${collectionPath}:`, error);
        return throwError(() => error);
      })
    );
  }

  getDocument(collectionPath: string, documentId: string): Observable<any> {
    const docRef = doc(this.firestore, `${collectionPath}/${documentId}`);
    return from(getDoc(docRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          return { id: doc.id, ...doc.data() };
        }
        return null;
      }),
      catchError(error => {
        console.error(`Error fetching document ${documentId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Authentication and Navigation Methods
  isInitialized(): boolean {
    return !!this.firestore;
  }

  // Game State and Data Methods
  getScoringRules(): Observable<ScoringRules> {
    return from(getDoc(this.scoringRulesRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          return doc.data() as ScoringRules;
        }
        throw new Error('Scoring rules not found');
      }),
      catchError(error => {
        console.error('Error fetching scoring rules:', error);
        return throwError(() => error);
      })
    );
  }

  updateScoringRules(rules: ScoringRules): Observable<void> {
    return from(setDoc(this.scoringRulesRef, rules)).pipe(
      tap(() => console.log('Scoring rules updated successfully')),
      catchError(error => {
        console.error('Error updating scoring rules:', error);
        return throwError(() => error);
      })
    );
  }

  submitScore(score: PlayerScore): Observable<void> {
    console.log('Submitting score:', score);
    const scoreWithTimestamp = {
      ...score,
      timestamp: serverTimestamp(),
      playerId: score.playerId || 'guest',
      playerName: score.playerName || 'Guest Player'
    };

    return from(setDoc(doc(this.scoresRef), scoreWithTimestamp)).pipe(
      tap(() => console.log('Score submitted successfully')),
      catchError(error => {
        console.error('Error submitting score:', error);
        return throwError(() => error);
      })
    );
  }

  getQuarterById(quarterId: string): Observable<Quarter | null> {
    return this.getDocument('quarters', quarterId);
  }

  getQuarters(): Observable<Quarter[]> {
    return this.getCollection('quarters') as Observable<Quarter[]>;
  }

  updateQuarter(quarterId: string, data: Partial<Quarter>): Observable<void> {
    const quarterRef = doc(this.firestore, `quarters/${quarterId}`);
    return from(updateDoc(quarterRef, data)).pipe(
      tap(() => console.log('Quarter updated successfully')),
      catchError(error => {
        console.error('Error updating quarter:', error);
        return throwError(() => error);
      })
    );
  }

  getAllQuarterStats(): Observable<QuarterStats[]> {
    return this.getCollection('quarters').pipe(
      map(quarters => quarters.map(quarter => ({
        id: quarter.id,
        name: quarter.name,
        stats: quarter.stats,
        quarterId: quarter.quarterId,
        participationCount: quarter.participationCount || 0,
        averageScore: quarter.averageScore || 0,
        completionRate: quarter.completionRate || 0,
        guessAccuracy: quarter.guessAccuracy || 0
      })))
    );
  }

  getPlayerGameData(playerId: string): Observable<any> {
    return this.getDocument('players', playerId);
  }

  getAllPlayerStats(playerId: string): Observable<PlayerStats[]> {
    return this.getCollection('scores').pipe(
      map(scores => scores
        .filter(score => score.playerId === playerId)
        .map(score => ({
          id: score.id,
          quarterId: score.quarterId,
          score: score.score,
          timestamp: score.timestamp,
          playerId: score.playerId,
          gamesPlayed: score.gamesPlayed || 0,
          totalScore: score.totalScore || 0,
          averageScore: score.averageScore || 0
        }))
      )
    );
  }

  saveGameProgress(playerId: string, state: GameState): Observable<void> {
    const docRef = doc(this.firestore, `gameProgress/${playerId}`);
    return from(setDoc(docRef, { ...state, timestamp: serverTimestamp() }));
  }
}
