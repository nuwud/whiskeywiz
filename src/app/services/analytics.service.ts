import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { firstValueFrom } from 'rxjs';
import { Chart } from 'chart.js';
import { Quarter, PlayerScore } from '../shared/models/quarter.model';
import { QuarterStats, PlayerStats } from '../shared/models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private firebaseService: FirebaseService) {}

  private mapQuarterToStats(quarters: Quarter[]): QuarterStats[] {
    return quarters.map(quarter => ({
      quarterId: quarter.id,
      playerCount: this.calculatePlayerCount(quarter),
      averageScore: this.calculateAverageScore(quarter)
    }));
  }

  private calculatePlayerCount(quarter: Quarter): number {
    return new Set(quarter.scores?.map(score => score.playerId)).size || 0;
  }

  private calculateAverageScore(quarter: Quarter): number {
    if (!quarter.scores?.length) return 0;
    const sum = quarter.scores.reduce((acc, score) => acc + score.score, 0);
    return sum / quarter.scores.length;
  }

  async getAnalyticsData() {
    try {
      const quarters = await firstValueFrom(this.firebaseService.getQuarterStats());
      const playerStats = await firstValueFrom(this.firebaseService.getPlayerStats());
      
      const quarterStats = this.mapQuarterToStats(quarters || []);

      return {
        participation: this.processParticipationTrend(quarterStats),
        accuracy: this.processAccuracyStats(quarterStats),
        devices: this.processDeviceStats(playerStats || []),
        locations: this.processLocationStats(playerStats || [])
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }

  private processParticipationTrend(stats: QuarterStats[]) {
    return stats.map(stat => ({
      quarter: stat.quarterId,
      players: stat.playerCount
    }));
  }

  private processAccuracyStats(stats: QuarterStats[]) {
    const totalScores = stats.reduce((sum, stat) => sum + (stat.averageScore || 0), 0);
    return totalScores / (stats.length || 1);
  }

  private processDeviceStats(stats: PlayerStats[]) {
    const devices: {[key: string]: number} = {};
    stats.forEach(stat => {
      const deviceType = stat.deviceType || 'unknown';
      devices[deviceType] = (devices[deviceType] || 0) + 1;
    });
    return devices;
  }

  private processLocationStats(stats: PlayerStats[]) {
    const locations: {[key: string]: number} = {};
    stats.forEach(stat => {
      const location = stat.regionCode || 'unknown';
      locations[location] = (locations[location] || 0) + 1;
    });
    return locations;
  }

  logEvent(eventName: string, params?: Record<string, any>) {
    this.firebaseService.logEvent(eventName, params);
  }
}