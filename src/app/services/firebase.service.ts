import { Injectable, Inject } from '@angular/core';
import { 
  Firestore, CollectionReference, collection, 
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, getDocs
} from '@angular/fire/firestore';
import { Analytics } from '@angular/fire/analytics';
import { Observable, from, of, throwError } from 'rxjs';
import { Quarter } from '../shared/models/quarter.model';
import { GameState } from '../shared/models/game.model';
import { Score } from '../shared/models/score.model';
import { QuarterStats, PlayerStats } from '../shared/models/analytics.model';
import { GameService } from './game.service';
import { QuarterPopulationService } from './quarter-population.service';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private quartersRef: CollectionReference;
  private gameStatesRef: CollectionReference;
  private scoresRef: CollectionReference;

  constructor(
    @Inject('FIREBASE_FIRESTORE') private firestore: Firestore,
    @Inject('FIREBASE_ANALYTICS') private analytics: Analytics,
    private gameService: GameService,
    private quarterPopulationService: QuarterPopulationService
  ) {
    this.quartersRef = collection(this.firestore, 'quarters');
    this.gameStatesRef = collection(this.firestore, 'gameStates');
    this.scoresRef = collection(this.firestore, 'scores');
  }

  async getCurrentQuarterId(): Promise<string> {
    const gameData = await this.gameService.loadGameData();
    return gameData?.quarterId || this.getCurrentQuarterString();
  }

  private getCurrentQuarterString(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${month}${year}`;
  }

  async validateQuarterExists(quarterId: string): Promise<boolean> {
    try {
      // First check using QuarterPopulationService
      const existsInService = await this.quarterPopulationService.quarterExists(quarterId);
      if (existsInService) return true;

      // Fallback to direct Firestore check
      const docRef = doc(this.quartersRef, quarterId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error validating quarter:', error);
      return false;
    }
  }

  async saveScore(score: { score: number, timestamp: number }): Promise<void> {
    const currentQuarterId = await this.getCurrentQuarterId();
    
    // Validate quarter exists before saving
    const quarterExists = await this.validateQuarterExists(currentQuarterId);
    if (!quarterExists) {
      throw new Error(`Quarter ${currentQuarterId} does not exist`);
    }

    await this.submitScore(currentQuarterId, { 
      score: score.score, 
      timestamp: score.timestamp 
    });
  }

  // Rest of the existing methods remain the same
}