import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Quarter, Sample, PlayerScore, SampleLetter, QuarterWithLetters } from '../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}

  // Quarter Management
  getAllQuarters(): Observable<Quarter[]> {
    return this.firestore.collection<Quarter>('quarters')
      .valueChanges({ idField: 'id' })
      .pipe(
        map(quarters => quarters.sort((a, b) => 
          this.parseQuarterId(b.id) - this.parseQuarterId(a.id))
        )
      );
  }

  getQuarterById(mmyy: string): Observable<Quarter | null> {
    return this.firestore.doc<Quarter>(`quarters/${mmyy}`)
      .valueChanges()
      .pipe(
        map(quarter => quarter ? { ...quarter, id: mmyy } : null)
      );
  }

  updateQuarter(quarter: Quarter): Promise<void> {
    const { id, ...quarterData } = quarter;
    return this.firestore.doc(`quarters/${id}`).update(quarterData);
  }

  setQuarterActive(quarterId: string, active: boolean): Promise<void> {
    return this.firestore.doc(`quarters/${quarterId}`).update({ active });
  }

  saveQuarter(quarter: Quarter): Promise<void> {
    const { id, ...data } = quarter;
    return this.firestore.doc(`quarters/${id}`).set(data);
  }

  // Score Management
  saveScore(quarterId: string, userId: string, score: number): Promise<void> {
    const scoreData: PlayerScore = {
      score,
      timestamp: Date.now(),
      playerId: userId,
      quarterId
    };
    return this.firestore.collection('scores').add(scoreData).then();
  }

  getQuarterScores(quarterId: string): Observable<PlayerScore[]> {
    return this.firestore.collection<PlayerScore>('scores', ref => 
      ref.where('quarterId', '==', quarterId)
         .orderBy('score', 'desc')
         .limit(100)
    ).valueChanges({ idField: 'id' });
  }

  getUserScores(userId: string): Observable<PlayerScore[]> {
    return this.firestore.collection<PlayerScore>('scores', ref =>
      ref.where('playerId', '==', userId)
         .orderBy('timestamp', 'desc')
    ).valueChanges({ idField: 'id' });
  }

  // Validation and Utilities
  validateQuarter(quarter: Quarter): boolean {
    return !!(
      quarter.id &&
      quarter.name &&
      quarter.samples?.sample1 &&
      quarter.samples?.sample2 &&
      quarter.samples?.sample3 &&
      quarter.samples?.sample4
    );
  }

  validateSample(sample: Sample): boolean {
    return !!(
      sample &&
      typeof sample.age === 'number' &&
      typeof sample.proof === 'number' &&
      sample.mashbill &&
      sample.age >= 0 &&
      sample.proof >= 0
    );
  }

  // Helper Methods
  private parseQuarterId(id: string): number {
    const month = parseInt(id.substring(0, 2));
    const year = parseInt(id.substring(2));
    return (year * 12) + month;
  }

  convertToLetterFormat(quarter: Quarter): QuarterWithLetters {
    const { samples, ...rest } = quarter;
    const letterSamples: Record<SampleLetter, Sample> = {
      'A': samples.sample1,
      'B': samples.sample2,
      'C': samples.sample3,
      'D': samples.sample4
    };
    return {
      ...rest,
      samples: letterSamples
    };
  }
}