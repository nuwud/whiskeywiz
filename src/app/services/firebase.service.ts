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
  // ... Previous code remains the same ...

  // Quarter Management Methods
  getQuarters(): Observable<Quarter[]> {
    return this.firestore.collection<Quarter>('quarters')
      .valueChanges({ idField: 'id' })
      .pipe(
        map(quarters => quarters.filter(isValidQuarter)),
        tap(quarters => console.log('Valid quarters fetched:', quarters.length)),
        catchError(error => {
          console.error('Error fetching quarters:', error);
          return throwError(() => new Error(`Failed to fetch quarters: ${error.message}`));
        })
      );
  }

  getQuarterById(id: string): Observable<Quarter | null> {
    return this.quartersCollection.doc<Quarter>(id)
      .get({ source: 'server' })
      .pipe(
        map(doc => {
          if (!doc.exists) {
            console.log(`Quarter ${id} not found`);
            return null;
          }
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
        catchError(error => {
          console.error(`Error fetching quarter ${id}:`, error);
          return throwError(() => new Error(`Failed to fetch quarter: ${error.message}`));
        })
      );
  }

  createQuarter(quarter: Quarter): Observable<void> {
    if (!isValidQuarter(quarter)) {
      return throwError(() => new Error('Invalid quarter data'));
    }
    
    return from(this.quartersCollection.doc(quarter.id).set(quarter))
      .pipe(
        tap(() => console.log('Quarter created successfully')),
        catchError(error => {
          console.error('Error creating quarter:', error);
          return throwError(() => new Error(`Failed to create quarter: ${error.message}`));
        })
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
      tap(() => console.log('Quarter updated successfully')),
      catchError(error => {
        console.error('Quarter update failed:', error);
        return throwError(() => new Error(`Failed to update quarter: ${error.message}`));
      })
    );
  }

  getActiveQuarters(): Observable<string[]> {
    return this.firestore
      .collection<Quarter>('quarters', ref => 
        ref.where('active', '==', true)
           .orderBy('name', 'desc')
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        map(quarters => quarters
          .filter(isValidQuarter)
          .map(quarter => quarter.id!)
        ),
        catchError(error => {
          console.error('Error fetching active quarters:', error);
          return of([]);
        })
      );
  }

  // ... Rest of the service code remains unchanged for now ...
}