import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';


export interface Quarter {
  id?: string;
  name: string;
  active: boolean;
  samples: {
    [key: string]: {
      mashbill: string;
      proof: number;
      age: number;
    }
  };
}

export interface PlayerScore {
  playerId: string;
  playerName: string;
  score: number;
  quarterId: string;
}

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

  getAuthState(): Observable<any> {
    return this.auth.authState;
  }

  getQuarters(): Observable<Quarter[]> {
    console.log('Fetching quarters from Firestore');
    return this.quartersCollection.get({ source: 'server' }).pipe(
      map(snapshot => {
        const quarters = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            active: data.active,
            samples: data.samples,
          } as Quarter;
        });
        console.log('Fetched quarters:', quarters);
        return quarters;
      }),
      catchError(error => {
        console.error('Fetch error:', error);
        return throwError(() => new Error(`Failed to fetch quarters: ${error.message}`));
      })
    );
  }

  updateQuarter(quarterId: string, data: Quarter): Observable<void> {
    console.log(`Updating quarter ${quarterId} with data:`, data);
    return from(this.quartersCollection.doc(quarterId).set(data, { merge: true }))
      .pipe(
        tap(() => console.log(`Quarter ${quarterId} update completed`)),
        catchError(error => {
          console.error(`Error updating quarter ${quarterId}:`, error);
          return throwError(() => new Error(`Failed to update quarter: ${error.message}`));
        })
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
              samples: data.samples,
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


  submitScore(score: PlayerScore): Observable<void> {
    return from(this.scoresCollection.add(score)).pipe(
      map(() => undefined)
    );
  }

  getLeaderboard(quarterId: string): Observable<PlayerScore[]> {
    return this.firestore.collection<PlayerScore>('scores', ref => 
      ref.where('quarterId', '==', quarterId).orderBy('score', 'desc').limit(10)
    ).valueChanges();
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
    const id = this.generateQuarterId(quarter.name);
    return from(this.quartersCollection.doc(id).set(quarter)).pipe(
      map(() => { 
        quarter.id = id;
        return;
      })
    );
  }  
  
  getQuarterGameData(quarterId: string): Observable<Quarter | undefined> {
    return this.quartersCollection.doc<Quarter>(quarterId).valueChanges();
  }
  
  createNewQuarter(quarterData: Quarter): Observable<void> {
    const quarterId = this.generateQuarterId(quarterData.name);
    return from(this.quartersCollection.doc(quarterId).set(quarterData));
  }

  updateScoringRules(rules: any): Observable<void> {
    return from(this.scoringRulesDoc.set(rules));
  }

  getScoringRules(): Observable<any> {
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
  
}