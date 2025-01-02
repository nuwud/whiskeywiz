import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { GameState } from '../shared/models/game.model';
import { DocumentData, DocumentReference, Firestore, doc as firestoreDoc, setDoc as firestoreSetDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataCollectionService {
  constructor(private firebaseService: FirebaseService, private firestore: Firestore) {}

  async collectGameData(gameData: {
    quarterId: string;
    guesses: GameState['guesses'];
    scores: { [key: string]: number };
    ratings: { [key: string]: number };
    location?: {
      country: string;
      region: string;
      city: string;
    };
    deviceInfo?: {
      platform: string;
      userAgent: string;
      language: string;
    };
    shopifyCustomerId?: string;
    completionTime?: number;
  }): Promise<void> {
    try {
      // Add timestamp
      const dataWithTimestamp = {
        ...gameData,
        timestamp: new Date().toISOString(),
      };

      // Store in Firebase
      await this.firebaseService.saveGameData(dataWithTimestamp);
    } catch (error) {
      console.error('Error collecting game data:', error);
      throw error;
    }
  }

  async getPlayerAnalytics(playerId: string) {
    try {
      return await this.firebaseService.getPlayerGameData(playerId);
    } catch (error) {
      console.error('Error fetching player analytics:', error);
      throw error;
    }
  }

  recordInteraction(event: string, data?: any): Observable<void> {
    const docRef = doc(this.firestore, `interactions/${event}`);
    return from(setDoc(docRef, data || {}));
  }

  initializeSession(quarterId: string): Observable<void> {
    const docRef = doc(this.firestore, `sessions/${quarterId}`);
    return from(setDoc(docRef, { initialized: true }));
  }

  finalizeSession(totalScore: number, completed: boolean): Observable<void> {
    const docRef = doc(this.firestore, `sessions/finalize`);
    return from(setDoc(docRef, { totalScore, completed }));
  }
}

function doc(firestore: Firestore, path: string): DocumentReference<DocumentData> {
  return firestoreDoc(firestore, path);
}

function setDoc(docRef: DocumentReference<DocumentData>, data: { totalScore?: number; completed?: boolean; initialized?: boolean }): Promise<void> {
  return firestoreSetDoc(docRef, data);
}

