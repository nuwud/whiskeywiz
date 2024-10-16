import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Quarter {
  id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  samples: {
    [key: string]: {
      mashbill: string;
      proof: number;
      age: number;
    }
  };
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private quartersCollection: AngularFirestoreCollection<Quarter>;

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private database: AngularFireDatabase,
    private functions: AngularFireFunctions,
    private analytics: AngularFireAnalytics
  ) {
    this.quartersCollection = this.firestore.collection<Quarter>('quarters');
  }

  getQuarters(): Observable<Quarter[]> {
    return this.quartersCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<Quarter>[]) => 
        actions.map(a => {
          const data = a.payload.doc.data() as Quarter;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getQuarterGameData(quarterId: string): Observable<Quarter | undefined> {
    return this.quartersCollection.doc<Quarter>(quarterId).valueChanges();
  }

  updateQuarter(quarterId: string, data: Partial<Quarter>): Promise<void> {
    return this.quartersCollection.doc(quarterId).update(data);
  }

  createNewQuarter(quarterData: Quarter): Promise<void> {
    const quarterId = this.generateQuarterId(quarterData.startDate);
    return this.quartersCollection.doc(quarterId).set(quarterData);
  }

  private generateQuarterId(date: Date): string {
    const year = date.getFullYear().toString().substring(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${month}${year}`;
  }

  // Generic Firestore operations
  getCollection(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName).valueChanges({ idField: 'id' });
  }

  addDocument(collectionName: string, data: any): Promise<any> {
    return this.firestore.collection(collectionName).add(data);
  }

  getDocument(collectionName: string, docId: string): Observable<any> {
    return this.firestore.collection(collectionName).doc(docId).valueChanges();
  }

  updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
    return this.firestore.collection(collectionName).doc(docId).update(data);
  }

  deleteDocument(collectionName: string, docId: string): Promise<void> {
    return this.firestore.collection(collectionName).doc(docId).delete();
  }

  // Authentication operations
  signIn(email: string, password: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return this.auth.signOut();
  }

  // Storage operations
  uploadFile(path: string, file: File): Promise<any> {
    return this.storage.upload(path, file).then(snapshot => snapshot.ref.getDownloadURL());
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