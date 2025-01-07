export interface QuarterStats {
  quarterId: string;
  playerCount: number;
  averageScore: number;
  completionRate?: number;
}

export interface PlayerStats {
  deviceType: string;
  regionCode: string;
  lastPlayed: Date;
}