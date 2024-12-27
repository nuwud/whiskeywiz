import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Observable, from, throwError, of } from 'rxjs';
import * as functions from 'firebase-functions';
import { CallableRequest } from 'firebase-functions/v2/https';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';        
import { Quarter, PlayerScore, ScoringRules, GameState } from '../shared/models/quarter.model';
import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private quartersCollection: AngularFirestoreCollection<Quarter>;
  private scoresCollection: AngularFirestoreCollection<PlayerScore>;
  private scoringRulesDoc: AngularFirestoreDocument<any>;
  private customEventsCollection: AngularFirestoreCollection<any>;

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private database: AngularFireDatabase,
    private functions: AngularFireFunctions,
    private analytics: AngularFireAnalytics
  ) {
    this.quartersCollection = this.firestore.collection<Quarter>('quarters');
    this.scoresCollection = this.firestore.collection<PlayerScore>('scores');
    this.scoringRulesDoc = this.firestore.doc('config/scoringRules');
    this.customEventsCollection = this.firestore.collection('customEvents');
  }

  // Add to existing FirebaseService
saveAnalyticsSession(sessionData: any): Observable<void> {
  return from(this.firestore.collection('analytics').doc(sessionData.sessionId).set(sessionData));
}

updateAnalyticsSession(sessionId: string, updates: any): Observable<void> {
  return from(this.firestore.collection('analytics').doc(sessionId).update(updates));
}

linkAnalyticsToUser(userId: string, sessionId: string): Observable<void> {
  return from(this.firestore.collection('users').doc(userId).update({
    analyticsSessions: firebase.firestore.FieldValue.arrayUnion(sessionId)
  }));
}

  getAuthState(): Observable<any> {
    return this.auth.authState;
  }

  gameProgress(authId: string): Observable<GameState> {
    return this.firestore.collection('gameProgress').doc(authId).valueChanges() as Observable<GameState>;
  }

  gameProgressRef(authId: string): AngularFirestoreDocument<GameState> {
    return this.firestore.collection('gameProgress').doc(authId);
  }

  gameProgressSet(authId: string, gameState: GameState): Observable<void> {
    return from(this.firestore.collection('gameProgress').doc(authId).set(gameState));
  }

  gameProgressUpdate(authId: string, gameState: Partial<GameState>): Observable<void> {
    return from(this.firestore.collection('gameProgress').doc(authId).update(gameState));
  }

  gameProgressDelete(authId: string): Observable<void> {
    return from(this.firestore.collection('gameProgress').doc(authId).delete());
  }

  gameProgressBatch(batch: any): Observable<void> {
    return from(batch.commit()).pipe(map(() => undefined));
  }
  
  gameProgressBatchSet(authId: string, gameState: GameState): any {
    const batch = this.firestore.firestore.batch();
    const docRef = this.firestore.collection('gameProgress').doc(authId).ref;
    batch.set(docRef, gameState);
    return batch;
  }

  gameProgressBatchUpdate(authId: string, gameState: Partial<GameState>): any {
    const batch = this.firestore.firestore.batch();
    const docRef = this.firestore.collection('gameProgress').doc(authId).ref;
    batch.update(docRef, gameState);
    return batch;
  }

  gameProgressBatchDelete(authId: string): any {
    const batch = this.firestore.firestore.batch();
    const docRef = this.firestore.collection('gameProgress').doc(authId).ref;
    batch.delete(docRef);
    return batch;
  }

  gameState(authId: string): Observable<GameState> {
      return this.firestore.collection('gameProgress').doc(authId).valueChanges() as Observable<GameState>;
    }
  
  gameStateRef(authId: string): AngularFirestoreDocument<GameState> {
      return this.firestore.collection('gameProgress').doc(authId);
    }
  
  gameStateSet(authId: string, gameState: GameState): Observable<void> {
      return from(this.firestore.collection('gameProgress').doc(authId).set(gameState));
    }
  
  updateQuarter(quarterId: string, quarterData: Partial<Quarter>): Observable<void> {
    console.log('Attempting to update quarter:', { quarterId, quarterData });
    const docRef = this.firestore.collection('quarters').doc(quarterId);
    
    return from(docRef.get()).pipe(
      tap(doc => {
        if (!doc.exists) {
          throw new Error(`Quarter document ${quarterId} does not exist`);
        }
      }),
      tap(() => console.log('Document exists, proceeding with update')),
      switchMap(() => from(docRef.update(quarterData))),
      tap(() => console.log('Quarter update successful')),
      catchError(error => {
        console.error('Quarter update failed:', error);
        throw error;
      })
    );
  }

  async updateQuarterAndScores(
    quarterId: string, 
    quarterData: Partial<Quarter>,
    scores: PlayerScore[]
  ): Promise<void> {
    const batch = this.firestore.firestore.batch();
    
    // Update quarter
    const quarterRef = this.quartersCollection.doc(quarterId).ref;
    batch.update(quarterRef, quarterData);
    
    // Update scores
    scores.forEach(score => {
      const scoreRef = this.scoresCollection.doc(score.id).ref;
      batch.set(scoreRef, score, { merge: true });
    });
    
    return batch.commit();
  }

  getQuarters(): Observable<Quarter[]> {
    return this.firestore.collection<Quarter>('quarters').valueChanges({ idField: 'id' }).pipe(
      tap(quarters => console.log('Fetched quarters:', quarters))
    );
  }

  getQuarterById(id: string): Observable<Quarter | null> {
    console.log(`Fetching quarter ${id} from Firestore`);
    return this.quartersCollection.doc<Quarter>(id)
      .get({ source: 'server' })
      .pipe(
        map(doc => {
          console.log(`Quarter ${id} raw response:`, doc);
          if (doc.exists) {
            const data = doc.data() as any;
            const result: Quarter = {
              id: doc.id,
              name: data.name,
              active: data.active,
              samples: data.samples || {}, // Ensure samples is defined
              ...(data.startDate && { startDate: data.startDate }),
              ...(data.endDate && { endDate: data.endDate })
            };
            console.log(`Quarter ${id} processed data:`, result);
            return result;
          } else {
            console.log(`Quarter ${id} not found`);
            return null;
          }
        }),
        catchError(error => {
          console.error(`Error fetching quarter ${id}:`, error);
          return throwError(() => new Error(`Failed to fetch quarter: ${error.message}`));
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
        map(quarters => quarters.map(quarter => quarter.id)),
        catchError(error => {
          console.error('Error fetching active quarters:', error);
          return of([]);
        })
      );
  }

  submitScore(score: PlayerScore): Observable<void> {
    console.log('Submitting score:', score);
    const timestamp = new Date();
    const scoreWithTimestamp = {
      ...score,
      timestamp,
      playerId: score.playerId || 'guest',
      playerName: score.playerName || 'Guest Player'
    };
    
    return from(this.scoresCollection.add(scoreWithTimestamp)).pipe(
      tap(ref => console.log('Score submitted with ID:', ref.id)),
      map(() => undefined),
      catchError(error => {
        console.error('Error submitting score:', error);
        return throwError(() => error);
      })
    );
  }

  private generateQuarterId(quarterName: string): string {
    // Assuming quarter names are in format "Q1 2024", "Q2 2024", etc.
    const [quarter, year] = quarterName.split(' ');
    const quarterNumber = quarter.substring(1); // Get the number after 'Q'
    // Convert Q1->01, Q2->04, Q3->07, Q4->10
    const month = ((parseInt(quarterNumber) - 1) * 3 + 1).toString().padStart(2, '0');
    const shortYear = year.substring(2);
    return `${month}${shortYear}`;
  }
  
  createQuarter(quarter: Quarter): Observable<void> { 
    return from(this.quartersCollection.doc(quarter.id).set(quarter)).pipe(
      map(() => undefined)
    );
  }  
  
  getQuarterGameData(quarterId: string): Observable<Quarter | undefined> {
    return this.quartersCollection.doc<Quarter>(quarterId).valueChanges();
  }
  
  createNewQuarter(quarterData: Quarter): Observable<void> {
    return from(this.quartersCollection.doc(quarterData.id).set(quarterData));
  }

  updateScoringRules(rules: ScoringRules): Observable<void> {
    return from(this.scoringRulesDoc.set(rules));
  }

  getScoringRules(): Observable<ScoringRules> {
    return this.scoringRulesDoc.valueChanges();
  }

  createCustomEvent(event: any): Observable<void> {
    return from(this.customEventsCollection.add(event)).pipe(map(() => undefined));
  }

  getCustomEvents(): Observable<any[]> {
    return this.customEventsCollection.valueChanges({ idField: 'id' });
  }

  // Generic Firestore operations
  getCollection(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName).valueChanges({ idField: 'id' });
  }

  addDocument(collectionName: string, data: any): Observable<any> {
    return from(this.firestore.collection(collectionName).add(data));
  }

  getDocument(collectionName: string, docId: string): Observable<any> {
    return this.firestore.collection(collectionName).doc(docId).valueChanges();
  }

  updateDocument(collectionName: string, docId: string, data: any): Observable<void> {
    return from(this.firestore.collection(collectionName).doc(docId).update(data));
  }

  deleteDocument(collectionName: string, docId: string): Observable<void> {
    return from(this.firestore.collection(collectionName).doc(docId).delete());
  }

  // Authentication operations
  signIn(email: string, password: string): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(email, password));
  }

  signOut(): Observable<void> {
    return from(this.auth.signOut());
  }

  // Storage operations
  uploadFile(path: string, file: File): Observable<string> {
    return from(this.storage.upload(path, file)).pipe(
      switchMap(snapshot => snapshot.ref.getDownloadURL())
    );
  }

  // Realtime Database operations
  getDatabaseRef(path: string): Observable<any> {
    return this.database.object(path).valueChanges();
  }

  // Cloud Functions operations
  callFunction(name: string, data: any): Observable<any> {
    return this.functions.httpsCallable(name)(data);
  }

  // Analytics operations
  logEvent(eventName: string, eventParams: any): void {
    this.analytics.logEvent(eventName, eventParams);
  }

  // Game state operations
  saveGameProgress(authId: string, gameState: GameState): Promise<void> {
      return this.firestore.collection('gameProgress').doc(authId).set(gameState);
      // Implement the logic to save game progress
  
  }
  
}

interface SetAdminData {
  userId: string;
}

interface SetAdminContext {
  auth?: {
    uid: string;
    token: {
      [key: string]: any;
    };
  };
}

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated().pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}