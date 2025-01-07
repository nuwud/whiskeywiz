import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { firstValueFrom } from 'rxjs';
import { Chart } from 'chart.js';
import { QuarterStats, PlayerStats } from '../shared/models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private firebaseService: FirebaseService) {}

  async getAnalyticsData() {
    try {
      const quarterStats = await this.firebaseService.getQuarterStats().toPromise();
      const playerStats = await this.firebaseService.getPlayerStats().toPromise();

      return {
        participation: this.processParticipationTrend(quarterStats || []),
        accuracy: this.processAccuracyStats(quarterStats || []),
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