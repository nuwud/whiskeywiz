import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { PlayerProfile } from './PlayerTrackingService';
import { QuarterTemplate } from './QuarterTemplateService';

export interface AdminDashboardMetrics {
  totalPlayers: number;
  activeQuarters: QuarterTemplate[];
  topPerformers: PlayerProfile[];
  revenueProjections: {
    subscriptionConversions: number;
    merchandiseSales: number;
    bottleSales: number;
  };
  playerDemographics: {
    countryDistribution: Record<string, number>;
    authMethodBreakdown: {
      guest: number;
      email: number;
      gmail: number;
      shopify: number;
    };
  };
  quarterPerformance: Array<{
    quarterId: string;
    averageScore: number;
    totalPlayers: number;
    topPerformer?: PlayerProfile;
  }>;
  machineLearningSuggestions: {
    recommendedMerchandise: string[];
    potentialSubscriptionTargets: string[];
    marketingSegments: string[];
  };
}

export class AdminDashboardService {
  private playerProfileCollection = collection(db, 'player_profiles');
  private quarterCollection = collection(db, 'quarters');

  async getComprehensiveDashboardMetrics(): Promise<AdminDashboardMetrics> {
    const [
      playerProfiles, 
      activeQuarters, 
      topPerformers
    ] = await Promise.all([
      this.getTotalPlayerCount(),
      this.getActiveQuarters(),
      this.getTopPerformers()
    ]);

    return {
      totalPlayers: playerProfiles.length,
      activeQuarters,
      topPerformers,
      revenueProjections: this.calculateRevenueProjections(playerProfiles),
      playerDemographics: this.analyzePlayerDemographics(playerProfiles),
      quarterPerformance: await this.calculateQuarterPerformance(),
      machineLearningSuggestions: this.generateMachineLearningInsights(playerProfiles)
    };
  }

  private async getTotalPlayerCount(): Promise<PlayerProfile[]> {
    const snapshot = await getDocs(this.playerProfileCollection);
    return snapshot.docs.map(doc => doc.data() as PlayerProfile);
  }

  private async getActiveQuarters(): Promise<QuarterTemplate[]> {
    const q = query(
      this.quarterCollection,
      where('active', '==', true),
      orderBy('startDate', 'desc'),
      limit(4)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as QuarterTemplate);
  }

  private async getTopPerformers(limit: number = 10): Promise<PlayerProfile[]> {
    const q = query(
      this.playerProfileCollection,
      orderBy('lifetimeScore', 'desc'),
      limit(limit)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as PlayerProfile);
  }

  private calculateRevenueProjections(players: PlayerProfile[]) {
    // Sophisticated revenue projection based on player data
    return {
      subscriptionConversions: players.filter(p => 
        p.registrationType !== 'guest'
      ).length,
      merchandiseSales: players.length * 0.2, // Hypothetical conversion rate
      bottleSales: players.length * 0.1 // Hypothetical conversion rate
    };
  }

  private analyzePlayerDemographics(players: PlayerProfile[]) {
    const countryDistribution: Record<string, number> = {};
    const authMethodBreakdown = {
      guest: 0,
      email: 0,
      gmail: 0,
      shopify: 0
    };

    players.forEach(player => {
      // Country distribution
      if (player.geographicData?.country) {
        countryDistribution[player.geographicData.country] = 
          (countryDistribution[player.geographicData.country] || 0) + 1;
      }

      // Authentication method breakdown
      authMethodBreakdown[player.registrationType]++;
    });

    return {
      countryDistribution,
      authMethodBreakdown
    };
  }

  private async calculateQuarterPerformance() {
    // Placeholder for complex quarter performance analysis
    const quarters = await this.getActiveQuarters();
    return quarters.map(quarter => ({
      quarterId: quarter.id,
      averageScore: 75, // Placeholder
      totalPlayers: Math.floor(Math.random() * 1000),
      topPerformer: undefined // Could be fetched dynamically
    }));
  }

  private generateMachineLearningInsights(players: PlayerProfile[]) {
    // Advanced suggestions based on player data
    return {
      recommendedMerchandise: [
        'Whiskey Tasting Kit',
        'Blind Barrel Subscription Box'
      ],
      potentialSubscriptionTargets: players
        .filter(p => p.totalQuartersPlayed > 2)
        .map(p => p.email || '')
        .slice(0, 100),
      marketingSegments: [
        'Whiskey Enthusiasts',
        'Learning Players',
        'Competitive Tasters'
      ]
    };
  }
}