import { Injectable } from '@angular/core';
import { 
  DocumentReference, 
  CollectionReference, 
  Firestore, 
  collection, 
  doc,
  getDoc,
  setDoc,
  serverTimestamp 
} from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ScoringRules } from '../shared/models/scoring.model';
import { PlayerScore } from '../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private scoringRulesRef: DocumentReference;
  private scoresRef: CollectionReference;

  constructor(private firestore: Firestore) {
    this.scoringRulesRef = doc(this.firestore, 'config/scoringRules');
    this.scoresRef = collection(this.firestore, 'scores');
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

  getQuarterById(quarterId: string): Observable<any> {
    const quarterRef = doc(this.firestore, `quarters/${quarterId}`);
    return from(getDoc(quarterRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          return { id: doc.id, ...doc.data() };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching quarter:', error);
        return throwError(() => error);
      })
    );
  }
}