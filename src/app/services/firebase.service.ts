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
  DocumentData,
  docData
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

  isInitialized(): boolean {
    return !!this.firestore;
  }

  navigateToAdmin() {
    this.router.navigate(['/#/admin']);
  }

  navigateToGame(quarterId: string) {
    this.router.navigate(['/#/game'], { queryParams: { quarter: quarterId } });
  }

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
    const quarterRef = doc(this.firestore, `quarters/${quarterId}`);
    return from(getDoc(quarterRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          return { id: doc.id, ...doc.data() } as Quarter;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching quarter:', error);
        return throwError(() => error);
      })
    );
  }

  getQuarters(): Observable<Quarter[]> {
    return collectionData(this.quartersRef, { idField: 'id' }).pipe(
      map(quarters => quarters as Quarter[]),
      catchError(error => {
        console.error('Error fetching quarters:', error);
        return throwError(() => error);
      })
    );
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
    return collectionData(this.quartersRef, { idField: 'id' }).pipe(
      map(quarters => quarters.map(quarter => ({
        id: quarter['id'],
        name: quarter['name'],
        stats: quarter['stats'],
        quarterId: quarter['quarterId'],
        participationCount: quarter['participationCount'] || 0,
        averageScore: quarter['averageScore'] || 0,
        completionRate: quarter['completionRate'] || 0,
        guessAccuracy: quarter['guessAccuracy'] || 0
      }) as QuarterStats[])),
      catchError(error => {
        console.error('Error fetching quarter stats:', error);
        return throwError(() => error);
      })
    );
  }

  getPlayerGameData(playerId: string): Observable<any> {
    const playerRef = doc(this.firestore, `players/${playerId}`);
    return from(getDoc(playerRef)).pipe(
      map(doc => doc.data() || {}),
      catchError(error => {
        console.error('Error fetching player game data:', error);
        return throwError(() => error);
      })
    );
  }

  getAllPlayerStats(playerId: string): Observable<PlayerStats[]> {
    return collectionData(this.scoresRef, { idField: 'id' }).pipe(
      map(scores => scores
        .filter(score => score['playerId'] === playerId)
        .map(score => ({
          id: score['id'],
          quarterId: score['quarterId'],
          score: score['score'],
          timestamp: score['timestamp'],
          playerId: score['playerId'],
          gamesPlayed: score['gamesPlayed'] || 0,
          totalScore: score['totalScore'] || 0,
          averageScore: score['averageScore'] || 0
        }) as PlayerStats)
      ),
      catchError(error => {
        console.error('Error fetching player stats:', error);
        return throwError(() => error);
      })
    );
  }

  saveGameProgress(playerId: string, state: GameState): Observable<void> {
    const docRef = doc(this.firestore, `gameProgress/${playerId}`);
    return from(setDoc(docRef, { ...state, timestamp: serverTimestamp() }));
  }

  getCollection(collectionName: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return collectionData(collectionRef);
  }

  getDocument(collectionName: string, documentId: string): Observable<any> {
    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    return docData(docRef);
  }
}
