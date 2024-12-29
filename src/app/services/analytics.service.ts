// src/app/services/analytics.service.ts

import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerAnalytics, ChartData } from '../shared/models/analytics.model';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private analyticsData = new BehaviorSubject<ChartData>({
        participationTrend: [],
        accuracyStats: [],
        deviceStats: [],
        locationStats: []
    });

    constructor(private firebaseService: FirebaseService) { }

    async fetchAnalyticsData(): Promise<void> {
        try {
            // Fetch raw data from Firebase
            const quarterData = await this.firebaseService.getAllQuarterStats();
            const playerData = await this.firebaseService.getAllPlayerStats();

            // Process participation trend
            const participationTrend = this.processParticipationTrend(quarterData);
            const accuracyStats = this.processAccuracyStats(quarterData);
            const deviceStats = this.processDeviceStats(playerData);
            const locationStats = this.processLocationStats(playerData);

            this.analyticsData.next({
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

    // Firebase Analytics Event Logging
    logGameStart(quarterId: string): void {
        this.firebaseService.logAnalyticsEvent('game_start', {
            quarter_id: quarterId,
            timestamp: new Date().toISOString()
        });
    }

    logGuessSubmitted(quarterId: string, sampleId: string, guessType: string): void {
        this.firebaseService.logAnalyticsEvent('guess_submitted', {
            quarter_id: quarterId,
            sample_id: sampleId,
            guess_type: guessType
        });
    }

    logGameCompleted(quarterId: string, totalScore: number, timeTaken: number): void {
        this.firebaseService.logAnalyticsEvent('game_completed', {
            quarter_id: quarterId,
            score: totalScore,
            completion_time: timeTaken
        });
    }

    private processParticipationTrend(data: any[]): any[] {
        // Group by quarter and calculate averages
        const grouped = data.reduce((acc, curr) => {
            const quarter = curr.quarterId;
            if (!acc[quarter]) {
                acc[quarter] = {
                    participants: 0,
                    totalScore: 0
                };
            }
            acc[quarter].participants++;
            acc[quarter].totalScore += curr.score;
            return acc;
        }, {});

        return Object.entries(grouped).map(([quarter, stats]: [string, any]) => ({
            quarter,
            participants: stats.participants,
            avgScore: stats.totalScore / stats.participants
        }));
    }

    private processAccuracyStats(data: any[]): any[] {
        // Calculate accuracy percentages for each guess type
        const accuracyTypes = ['age', 'proof', 'mashbill'];
        return accuracyTypes.map(type => ({
            type,
            accuracy: this.calculateAccuracy(data, type)
        }));
    }

    private processDeviceStats(data: any[]): any[] {
        // Process device type distribution
        const devices = data.reduce((acc, curr) => {
            const device = curr.deviceType;
            acc[device] = (acc[device] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(devices).map(([device, count]) => ({
            device,
            count
        }));
    }

    private processLocationStats(data: any[]): any[] {
        // Process location distribution
        const locations = data.reduce((acc, curr) => {
            const location = curr.location;
            acc[location] = (acc[location] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(locations).map(([location, count]) => ({
            location,
            count
        }));
    }

    private calculateAccuracy(data: any[], type: string): number {
        // Calculate accuracy percentage for a specific guess type
        const total = data.length;
        const correct = data.filter(item => item[`${type}Correct`]).length;
        return (correct / total) * 100;
    }
}