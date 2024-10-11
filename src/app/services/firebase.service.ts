import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private database: AngularFireDatabase,
    private functions: AngularFireFunctions,
    private analytics: AngularFireAnalytics
  ) {}

  // Firestore operations
  getCollection(path: string) {
    return this.firestore.collection(path).valueChanges();
  }

  addDocument(path: string, data: any) {
    return this.firestore.collection(path).add(data);
  }

  // Authentication operations
  signIn(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.auth.signOut();
  }

  // Storage operations
  uploadFile(path: string, file: File) {
    return this.storage.upload(path, file);
  }

  // Realtime Database operations
  getDatabaseRef(path: string) {
    return this.database.object(path);
  }

  // Cloud Functions operations
  callFunction(name: string, data: any) {
    return this.functions.httpsCallable(name)(data);
  }

  // Analytics operations
  logEvent(eventName: string, eventParams: any) {
    this.analytics.logEvent(eventName, eventParams);
  }
}