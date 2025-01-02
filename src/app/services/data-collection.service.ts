import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { GameState } from '../shared/models/game.model';

@Injectable({
  providedIn: 'root'
})
export class DataCollectionService {
  constructor(private firebaseService: FirebaseService) {}

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
}