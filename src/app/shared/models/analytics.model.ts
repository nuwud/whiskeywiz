export interface QuarterStats {
  id: string;
  name: string;
  quarterId: string;
  participationCount: number;
  averageScore: number;
  completionRate: number;
  guessAccuracy: {
    age: number;
    proof: number;
    mashbill: number;
  };
  stats?: any;
}

export interface PlayerStats {
  id: string;
  quarterId: string;
  score: number;
  timestamp: any;
  playerId: string;
  gamesPlayed: number;
  totalScore: number;
  averageScore: number;
}

export interface ChartSeries {
  name: string;
  value: number;
}

export interface ChartData {
  name: string;
  series: ChartSeries[];
  participationTrend?: any[];
  accuracyStats?: any[];
  deviceStats?: any[];
  locationStats?: any[];
}
