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
  serverTimestamp 
} from '@angular/fire/firestore';
import { ScoringRules } from '../shared/models/scoring.model';
import { PlayerScore, Quarter } from '../shared/models/quarter.model';
import { Observable, from, throwError } from 'rxjs';
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
}