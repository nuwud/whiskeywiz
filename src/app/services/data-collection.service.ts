import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { GameState, GameData } from '../shared/models/game.model';
import { 
  Firestore, 
  doc, 
  setDoc, 
  serverTimestamp, 
  collection, 
  DocumentReference 
} from '@angular/fire/firestore';

interface InteractionData {
  timestamp: any;
  method?: string;
  error?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataCollectionService {
  private sessionsRef: DocumentReference;
  private interactionsRef: DocumentReference;

  constructor(
    private firebaseService: FirebaseService, 
    private firestore: Firestore
  ) {
    this.sessionsRef = doc(collection(this.firestore, 'sessions'));
    this.interactionsRef = doc(collection(this.firestore, 'interactions'));
  }

  async collectGameData(gameData: GameData): Promise<void> {
    try {
      const enhancedData = await this.enhanceGameData(gameData);
      await this.firebaseService.saveGameProgress(
        enhancedData.playerId || 'guest',
        {
          quarterId: enhancedData.quarterId,
          guesses: enhancedData.guesses,
          scores: enhancedData.scores,
          currentSample: 0,
          isComplete: true,
          totalScore: Object.values(enhancedData.scores).reduce((a, b) => a + b, 0)
        }
      ).toPromise();
    } catch (error) {
      console.error('Error collecting game data:', error);
      throw error;
    }
  }

  recordInteraction(event: string, data: Partial<InteractionData> = {}): Observable<void> {
    const interactionRef = doc(collection(this.firestore, `interactions/${event}`));
    const interactionData: InteractionData = {
      ...data,
      timestamp: serverTimestamp()
    };

    return from(setDoc(interactionRef, interactionData));
  }

  initializeSession(quarterId: string, playerId?: string): Observable<void> {
    const sessionDoc = doc(this.firestore, `sessions/${quarterId}_${playerId || 'guest'}`);
    return from(setDoc(sessionDoc, {
      quarterId,
      playerId,
      startedAt: serverTimestamp(),
      status: 'initialized'
    }));
  }

  finalizeSession(
    quarterId: string, 
    playerId: string | undefined, 
    totalScore: number, 
    completed: boolean
  ): Observable<void> {
    const sessionDoc = doc(this.firestore, `sessions/${quarterId}_${playerId || 'guest'}`);
    return from(setDoc(sessionDoc, {
      completedAt: serverTimestamp(),
      totalScore,
      completed,
      status: completed ? 'completed' : 'abandoned'
    }, { merge: true }));
  }

  private async enhanceGameData(gameData: GameData): Promise<GameData> {
    try {
      return {
        ...gameData,
        deviceInfo: this.getDeviceInfo(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error enhancing game data:', error);
      return gameData;
    }
  }

  private getDeviceInfo() {
    return {
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenSize: `${window.screen.width}x${window.screen.height}`
    };
  }
}