import { Injectable } from '@angular/core';
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
  DocumentData
} from '@angular/fire/firestore';
import { ScoringRules } from '../shared/models/scoring.model';
import { PlayerScore, Quarter } from '../shared/models/quarter.model';
import { QuarterStats, PlayerStats } from '../shared/models/analytics.model';
import { Observable, from, throwError } from 'rxjs';
import { GameState } from '../shared/models/game.model'; // Adjust the path as necessary
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private scoringRulesRef: DocumentReference;
  private scoresRef: CollectionReference;
  private quartersRef: CollectionReference;

  constructor(private firestore: Firestore) {
    this.scoringRulesRef = doc(this.firestore, 'config/scoringRules');
    this.scoresRef = collection(this.firestore, 'scores');
    this.quartersRef = collection(this.firestore, 'quarters');
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
    return from(getDocs(this.quartersRef)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Quarter))
      ),
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
    return from(getDocs(this.quartersRef)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            stats: data.stats,
            quarterId: data.quarterId,
            participationCount: data.participationCount,
            averageScore: data.averageScore,
            completionRate: data.completionRate,
            guessAccuracy: data.guessAccuracy
          } as QuarterStats;
        })
      ),
      catchError(error => {
        console.error('Error fetching quarter stats:', error);
        return throwError(() => error);
      })
    );
  }

  async getPlayerGameData(playerId: string): Promise<any> {
    // Fetch player data from Firestore
    const playerRef = doc(this.firestore, `players/${playerId}`);
    const playerDoc = await getDoc(playerRef);
    const playerGameData = playerDoc.data();

    // Implementation to fetch player game data from Firebase

    // This is a placeholder implementation

    return {};

  }


  getAllPlayerStats(playerId: string): Observable<PlayerStats[]> {
    return from(getDocs(this.scoresRef)).pipe(
      map(snapshot =>
        snapshot.docs
          .filter(doc => doc.data().playerId === playerId)
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              quarterId: data.quarterId,
              score: data.score,
              timestamp: data.timestamp,
              playerId: data.playerId,
              gamesPlayed: data.gamesPlayed || 0,
              totalScore: data.totalScore || 0,
              averageScore: data.averageScore || 0
            } as PlayerStats;
          })
      ),
      catchError(error => {
        console.error('Error fetching player stats:', error);
        return throwError(() => error);
      })
    );
  }


  saveGameData(gameData: {

    timestamp: string;

    quarterId: string;

    guesses: GameState["guesses"];

    scores: { [key: string]: number; };

    ratings: { [key: string]: number; };

    location?: { country: string; region: string; city: string; };

    deviceInfo?: { platform: string; userAgent: string; language: string; };

    shopifyCustomerId?: string;

    completionTime?: number;

  }): void {

    // Implement this method to save game data

  }

  logAnalyticsEvent(eventName: string, eventParams: { [key: string]: any }): void {

    // Implementation for logging analytics event

    console.log(`Event: ${eventName}`, eventParams);

  }

  getCollection(collectionName: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return collectionData(collectionRef);
  }

  getDocument(collectionName: string, documentId: string): Observable<any> {
    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    return this.docData(docRef);
  }

private docData(docRef: DocumentReference<DocumentData, DocumentData>): Observable<any> {
  throw new Error('Function not implemented.');
}


saveGameProgress(playerId: string, state: any): Observable<void> {
  const docRef = doc(this.firestore, `gameProgress/${playerId}`);
  return from(setDoc(docRef, state));
}

}
