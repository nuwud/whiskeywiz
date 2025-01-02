import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { GameState } from '../shared/models/game.model';

export interface GameGuess {
  age: number;
  proof: number;
  mashbill: string;
  rating: number;  // Making rating required
}

export interface GameSession {
  sessionId: string;
  startTime: Date;
  interactions: any[];
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataCollectionService {
  private currentSession: GameSession | null = null;

  constructor(private firebaseService: FirebaseService) {}

  async initializeSession(): Promise<void> {
    this.currentSession = {
      sessionId: Math.random().toString(36).substring(2, 15),
      startTime: new Date(),
      interactions: [],
      completed: false
    };
  }

  async recordInteraction(interaction: any): Promise<void> {
    if (this.currentSession) {
      this.currentSession.interactions.push({
        ...interaction,
        timestamp: new Date()
      });
    }
  }

  async finalizeSession(): Promise<void> {
    if (this.currentSession) {
      this.currentSession.completed = true;
      await this.firebaseService.saveGameData({
        ...this.currentSession,
        endTime: new Date()
      });
      this.currentSession = null;
    }
  }

  async collectGameData(gameData: {
    quarterId: string;
    guesses: { [key: string]: GameGuess };
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
      const dataWithTimestamp = {
        ...gameData,
        timestamp: new Date().toISOString(),
      };
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