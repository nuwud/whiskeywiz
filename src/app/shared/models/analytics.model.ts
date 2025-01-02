// src/app/shared/models/analytics.model.ts

export interface QuarterStats {
    quarterId: string;
    participationCount: number;
    averageScore: number;
    completionRate: number;
    guessAccuracy: {
        age: number;
        proof: number;
        mashbill: number;
    };
}

export interface PlayerAnalytics {
    quarterStats: QuarterStats[];
    totalParticipation: number;
    avgCompletionTime: number;
    deviceTypes: Record<string, number>;
    locationData: Record<string, number>;
}

export interface PlayerStats {
    playerId: string;
    gamesPlayed: number;
    totalScore: number;
    averageScore: number;
    // Add other properties as needed
}

export interface ChartData {
    participationTrend: {
        quarter: string;
        participants: number;
        avgScore: number;
    }[];
    accuracyStats: {
        type: string;
        accuracy: number;
    }[];
    deviceStats: {
        device: string;
        count: number;
    }[];
    locationStats: {
        location: string;
        count: number;
    }[];
}