import { Injectable } from '@angular/core';
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
  query,
  where,
  addDoc 
} from '@angular/fire/firestore';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { ScoringRules } from '../shared/models/scoring.model';
import { PlayerScore, Quarter } from '../shared/models/quarter.model';
import { Observable, from, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private scoringRulesRef: DocumentReference;
  private scoresRef: CollectionReference;
  private quartersRef: CollectionReference;
  private gameDataRef: CollectionReference;

  constructor(
    private firestore: Firestore,
    private analytics: Analytics
  ) {
    this.scoringRulesRef = doc(this.firestore, 'config/scoringRules');
    this.scoresRef = collection(this.firestore, 'scores');
    this.quartersRef = collection(this.firestore, 'quarters');
    this.gameDataRef = collection(this.firestore, 'gameData');
  }

  // ... existing methods ...

  async getAllQuarterStats(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(this.gameDataRef);
      const stats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Group by quarter and calculate statistics
      const quarterStats = {};
      stats.forEach(stat => {
        if (!quarterStats[stat.quarterId]) {
          quarterStats[stat.quarterId] = {
            totalPlays: 0,
            averageScore: 0,
            totalScores: 0
          };
        }
        quarterStats[stat.quarterId].totalPlays++;
        quarterStats[stat.quarterId].totalScores += stat.scores ? 
          Object.values(stat.scores).reduce((a: number, b: number) => a + b, 0) : 0;
      });

      // Calculate averages
      Object.values(quarterStats).forEach(stat => {
        stat.averageScore = stat.totalScores / stat.totalPlays;
      });

      return Object.entries(quarterStats).map(([quarterId, stats]) => ({
        quarterId,
        ...stats
      }));
    } catch (error) {
      console.error('Error getting quarter stats:', error);
      throw error;
    }
  }

  async getAllPlayerStats(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(this.gameDataRef);
      const stats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Group by player and calculate statistics
      const playerStats = {};
      stats.forEach(stat => {
        if (!playerStats[stat.playerId]) {
          playerStats[stat.playerId] = {
            totalGames: 0,
            averageScore: 0,
            totalScore: 0,
            bestScore: 0,
            quartersPlayed: new Set()
          };
        }
        
        const gameScore = stat.scores ? 
          Object.values(stat.scores).reduce((a: number, b: number) => a + b, 0) : 0;
        
        playerStats[stat.playerId].totalGames++;
        playerStats[stat.playerId].totalScore += gameScore;
        playerStats[stat.playerId].bestScore = Math.max(
          playerStats[stat.playerId].bestScore,
          gameScore
        );
        playerStats[stat.playerId].quartersPlayed.add(stat.quarterId);
      });

      // Calculate averages and finalize stats
      return Object.entries(playerStats).map(([playerId, stats]) => ({
        playerId,
        totalGames: stats.totalGames,
        averageScore: stats.totalScore / stats.totalGames,
        bestScore: stats.bestScore,
        uniqueQuarters: Array.from(stats.quartersPlayed).length
      }));
    } catch (error) {
      console.error('Error getting player stats:', error);
      throw error;
    }
  }

  async logAnalyticsEvent(eventName: string, eventParams?: Record<string, any>): Promise<void> {
    try {
      await logEvent(this.analytics, eventName, eventParams);
    } catch (error) {
      console.error('Error logging analytics event:', error);
      // Don't throw error for analytics failures
    }
  }
}