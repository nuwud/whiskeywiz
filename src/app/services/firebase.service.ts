import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase.init';
import { GameState, ScoringRules } from '../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private scoringRulesRef = doc(firestore, 'config/scoringRules');

  // ... existing methods ...

  getScoringRules(): Observable<ScoringRules> {
    return from(getDoc(this.scoringRulesRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          return doc.data() as ScoringRules;
        }
        // Return default scoring rules if none exist
        return {
          agePerfectScore: 30,
          ageBonus: 10,
          agePenaltyPerYear: 5,
          proofPerfectScore: 30,
          proofBonus: 10,
          proofPenaltyPerPoint: 2,
          mashbillScore: 10
        };
      }),
      catchError(error => {
        console.error('Error fetching scoring rules:', error);
        return throwError(() => error);
      })
    );
  }

  updateScoringRules(rules: ScoringRules): Observable<void> {
    return from(setDoc(this.scoringRulesRef, rules)).pipe(
      catchError(error => {
        console.error('Error updating scoring rules:', error);
        return throwError(() => error);
      })
    );
  }
}