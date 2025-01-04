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
  private initialized = false;

  constructor(private firestore: Firestore, private router: Router) {
    try {
      this.scoringRulesRef = doc(this.firestore, 'config/scoringRules');
      this.scoresRef = collection(this.firestore, 'scores');
      this.quartersRef = collection(this.firestore, 'quarters');
      this.initialized = true;
      console.log('Firebase service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase service:', error);
      this.router.navigate(['/']);
    }
  }

  private ensureInitialized() {
    if (!this.initialized) {
      throw new Error('Firebase service not properly initialized');
    }
  }

  // Collection and Document Access Methods
  getCollection(collectionPath: string): Observable<any[]> {
    this.ensureInitialized();
    const collectionRef = collection(this.firestore, collectionPath);
    return collectionData(collectionRef, { idField: 'id' }).pipe(
      tap(data => console.log(`Retrieved ${data.length} documents from ${collectionPath}`)),
      catchError(error => {
        console.error(`Error fetching collection ${collectionPath}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Rest of the methods remain the same, but add this.ensureInitialized() at the start of each
}