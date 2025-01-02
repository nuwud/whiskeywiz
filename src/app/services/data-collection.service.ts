import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ShopifyService } from './shopify.service';
import firebase from 'firebase/compat/app';
import FieldValue = firebase.firestore.FieldValue;
import { GameState } from '../shared/models/quarter.model';

export interface PlayerAnalytics {
    sessionId: string;
    location: {
        country: string;
        region: string;
        city: string;
        timestamp: Date;
    };
    deviceInfo: {
        platform: string;
        userAgent: string;
        language: string;
        screenSize: string;
        isMobile: boolean;
        orientation: string;
    };
    shopifyData?: {
        customerId?: string;
        source: string;
        referrer: string;
        lastPurchaseDate?: Date;
    };
    gameData: {
        quarterId: string;
        startTime: Date;
        endTime?: Date;
        guesses: {
            sampleId: string;
            age: number;
            proof: number;
            mashbill: string;
            rating?: number;
            timeTaken: number;
            confidence?: number;
            attempts?: number;
        }[];
        totalScore?: number;
        shareAttempted?: boolean;
        completionTime?: number;
        averageGuessTime?: number;
    };
    engagement: {
        timeSpentPerSample: { [key: string]: number };
        totalPausedTime: number;
        sessionDuration?: number;
        interactionCount: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class DataCollectionService {
    private currentSession: PlayerAnalytics | null = null;
    private sessionStartTime: number = 0;
    private lastInteractionTime: number = 0;
    private pauseStartTime: number = 0;
    private totalPausedTime: number = 0;
    private interactionCount: number = 0;

    constructor(
        private firestore: AngularFirestore,
        private analytics: AngularFireAnalytics,
        private authService: AuthService,
        private shopifyService: ShopifyService
    ) {
        this.handleVisibilityChange();
    }

    private handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseStartTime = Date.now();
            } else if (this.pauseStartTime) {
                this.totalPausedTime += Date.now() - this.pauseStartTime;
                this.pauseStartTime = 0;
            }
        });
    }

    private getDeviceInfo() {
        const ua = navigator.userAgent;
        const isMobile = /Mobile|Android|iP(hone|od|ad)/.test(ua);

        return {
            platform: navigator.platform,
            userAgent: ua,
            language: navigator.language,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            isMobile,
            orientation: window.screen.orientation?.type || 'unknown'
        };
    }

    private calculateEngagementMetrics(): Partial<PlayerAnalytics['engagement']> {
        if (!this.currentSession) return {};

        const now = Date.now();
        const rawDuration = now - this.sessionStartTime;
        const sessionDuration = rawDuration - this.totalPausedTime;

        return {
            sessionDuration,
            totalPausedTime: this.totalPausedTime,
            interactionCount: this.interactionCount
        };
    }

    

    async initializeSession(quarterId: string): Promise<void> {
        const sessionId = crypto.randomUUID();
        const locationData = await this.getLocationData();
        const shopifyStatus = await this.shopifyService.isShopifyConnected().toPromise();

        this.sessionStartTime = Date.now();
        this.interactionCount = 0;
        this.totalPausedTime = 0;

        this.currentSession = {
            sessionId,
            location: {
                ...locationData,
                timestamp: new Date()
            },
            deviceInfo: this.getDeviceInfo(),
            shopifyData: {
                source: document.referrer,
                referrer: window.location.href
            },
            gameData: {
                quarterId,
                startTime: new Date(),
                guesses: []
            },
            engagement: {
                timeSpentPerSample: {},
                totalPausedTime: 0,
                interactionCount: 0
            }
        };

        await this.firestore.collection('sessions').doc(sessionId).set(this.currentSession);
        this.analytics.logEvent('game_session_start', {
            quarterId,
            sessionId,
            hasShopifyConnection: shopifyStatus,
            deviceType: this.currentSession.deviceInfo.isMobile ? 'mobile' : 'desktop'
        });
    }

    async recordInteraction(type: string, data?: any): Promise<void> {
        if (!this.currentSession) return;

        const now = Date.now();
        this.interactionCount++;

        if (this.lastInteractionTime) {
            const timeSinceLastInteraction = now - this.lastInteractionTime;
            if (timeSinceLastInteraction > 30000) { // 30 seconds threshold
                this.totalPausedTime += timeSinceLastInteraction;
            }
        }

        this.lastInteractionTime = now;

        await this.firestore.collection('sessions')
            .doc(this.currentSession.sessionId)
            .update({
                'engagement.interactionCount': this.interactionCount,
                'engagement.totalPausedTime': this.totalPausedTime,
                [`engagement.interactions.${type}`]: FieldValue.increment(1)
            });
    }

    async recordGuess(sampleId: string, guess: {
        age: number,
        proof: number,
        mashbill: string,
        rating?: number,
        timeTaken: number,
        confidence?: number,
        attempts?: number
    }): Promise<void> {
        if (!this.currentSession) throw new Error('No active session');

        const currentSampleStart = this.currentSession.engagement.timeSpentPerSample[sampleId] || 0;
        this.currentSession.engagement.timeSpentPerSample[sampleId] = currentSampleStart + guess.timeTaken;

        this.currentSession.gameData.guesses.push({
            sampleId,
            ...guess
        });

        const updates = {
            'gameData.guesses': this.currentSession.gameData.guesses,
            [`engagement.timeSpentPerSample.${sampleId}`]: this.currentSession.engagement.timeSpentPerSample[sampleId]
        };

        await this.firestore.collection('sessions')
            .doc(this.currentSession.sessionId)
            .update(updates);

        this.analytics.logEvent('sample_guess', {
            sampleId,
            quarterId: this.currentSession.gameData.quarterId,
            timeTaken: guess.timeTaken,
            attempts: guess.attempts || 1,
            hasRating: !!guess.rating
        });
    }

    async finalizeSession(totalScore: number, shareAttempted: boolean): Promise<void> {
        if (!this.currentSession) throw new Error('No active session');

        const endTime = new Date();
        const startTime = this.currentSession.gameData.startTime;
        const completionTime = endTime.getTime() - startTime.getTime();
        const averageGuessTime = this.currentSession.gameData.guesses.reduce(
            (acc, guess) => acc + guess.timeTaken, 0
        ) / this.currentSession.gameData.guesses.length;

        const engagement = this.calculateEngagementMetrics();
        const updates = {
            'gameData.endTime': endTime,
            'gameData.totalScore': totalScore,
            'gameData.shareAttempted': shareAttempted,
            'gameData.completionTime': completionTime,
            'gameData.averageGuessTime': averageGuessTime,
            'engagement': engagement
        };

        await this.firestore.collection('sessions')
            .doc(this.currentSession.sessionId)
            .update(updates);

        const userId = await this.authService.getCurrentUserId().toPromise();
        if (userId) {
            await this.firestore.collection('users').doc(userId).update({
                sessions: FieldValue.arrayUnion(this.currentSession.sessionId)
            });
        }

        this.analytics.logEvent('game_session_complete', {
            sessionId: this.currentSession.sessionId,
            quarterId: this.currentSession.gameData.quarterId,
            totalScore,
            shareAttempted,
            completionTime,
            averageGuessTime,
            totalInteractions: this.interactionCount,
            deviceType: this.currentSession.deviceInfo.isMobile ? 'mobile' : 'desktop'
        });
    }

    async collectGameData(gameData: {
        quarterId: string;
        guesses: { [key: string]: Guess };
        scores: { [key: string]: number };
        ratings: { [key: string]: number };
    }): Promise<void> {
        if (!this.currentSession) throw new Error('No active session');

        const updates = {
            'gameData.guesses': gameData.guesses,
            'gameData.scores': gameData.scores,
            'gameData.ratings': gameData.ratings
        };

        await this.firestore.collection('sessions')
            .doc(this.currentSession.sessionId)
            .update(updates);

        this.analytics.logEvent('game_data_collected', {
            quarterId: gameData.quarterId,
            sessionId: this.currentSession.sessionId,
            totalGuesses: Object.keys(gameData.guesses).length,
            totalScore: Object.values(gameData.scores).reduce((a, b) => a + b, 0)
        });
    }

    private async getLocationData() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return {
                country: data.country,
                region: data.region,
                city: data.city
            };
        } catch (error) {
            console.error('Location fetch failed:', error);
            return {
                country: 'unknown',
                region: 'unknown',
                city: 'unknown'
            };
        }
    }
}