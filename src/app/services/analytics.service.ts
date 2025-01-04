import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChartData, ChartSeries, QuarterStats, PlayerStats } from '../shared/models/analytics.model';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private analyticsData = new BehaviorSubject<ChartData>(this.getInitialChartData());

    constructor(private firebaseService: FirebaseService) { }

    async fetchAnalyticsData(): Promise<void> {
        try {
            const quarterStats = await firstValueFrom(this.firebaseService.getAllQuarterStats());
            if (!quarterStats) {
                throw new Error('Quarter stats data is undefined');
            }

            const playerStats = await firstValueFrom(this.firebaseService.getAllPlayerStats());

            const participationTrend = this.processParticipationTrend(quarterStats);
            const accuracyStats = this.processAccuracyStats(quarterStats);
            const deviceStats = this.processDeviceStats(playerStats);
            const locationStats = this.processLocationStats(playerStats);

            this.analyticsData.next({
                name: 'Whiskey Wiz Analytics',
                series: this.buildChartSeries(quarterStats),
                participationTrend,
                accuracyStats,
                deviceStats,
                locationStats
            });

        } catch (error) {
            console.error('Error fetching analytics data:', error);
            throw error;
        }
    }

    getAnalyticsData(): Observable<ChartData> {
        return this.analyticsData.asObservable();
    }

    private getInitialChartData(): ChartData {
        return {
            name: 'Loading...',
            series: [],
            participationTrend: [],
            accuracyStats: [],
            deviceStats: [],
            locationStats: []
        };
    }

    // Event Logging
    logEvent(eventName: string, eventParams: Record<string, any> = {}): void {
        this.firebaseService.logAnalyticsEvent(eventName, {
            ...eventParams,
            timestamp: new Date().toISOString()
        });
    }

    // Game Events
    logGameStart(quarterId: string): void {
        this.logEvent('game_start', { quarter_id: quarterId });
    }

    logGuessSubmitted(quarterId: string, sampleId: string, guessType: string): void {
        this.logEvent('guess_submitted', {
            quarter_id: quarterId,
            sample_id: sampleId,
            guess_type: guessType
        });
    }

    logGameCompleted(quarterId: string, totalScore: number, timeTaken: number): void {
        this.logEvent('game_completed', {
            quarter_id: quarterId,
            score: totalScore,
            completion_time: timeTaken
        });
    }

    // Data Processing
    private processParticipationTrend(stats: QuarterStats[]): ChartSeries[] {
        return stats.map(stat => ({
            name: stat.quarterId,
            value: stat.totalPlayers
        }));
    }

    private processAccuracyStats(stats: QuarterStats[]): ChartSeries[] {
        const totalCorrect = stats.reduce((sum, stat) => sum + (stat.topScore || 0), 0);
        const totalPossible = stats.length * 70; // 70 is max score per quarter
        const accuracy = (totalCorrect / totalPossible) * 100;

        return [{
            name: 'Overall Accuracy',
            value: accuracy
        }];
    }

    private processDeviceStats(stats: PlayerStats[]): ChartSeries[] {
        const deviceCounts = stats.reduce((acc, stat) => {
            const device = stat.device || 'unknown';
            acc[device] = (acc[device] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(deviceCounts).map(([device, count]) => ({
            name: device,
            value: count
        }));
    }

    private processLocationStats(stats: PlayerStats[]): ChartSeries[] {
        const locationCounts = stats.reduce((acc, stat) => {
            const location = stat.location || 'unknown';
            acc[location] = (acc[location] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(locationCounts).map(([location, count]) => ({
            name: location,
            value: count
        }));
    }

    private buildChartSeries(stats: QuarterStats[]): ChartSeries[] {
        return stats.map(stat => ({
            name: `Q${stat.quarterId}`,
            value: stat.averageScore
        }));
    }
}