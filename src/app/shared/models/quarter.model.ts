export interface Quarter {
  id: string;
  name: string;
  active: boolean;
  samples: Sample[];
  startDate?: Date;
  endDate?: Date;
}

export interface Sample {
  id: string;
  age: number;
  proof: number;
  mashbill: string;
  name?: string;
  distillery?: string;
}

export interface PlayerScore {
  score: number;
  timestamp: number;
  playerId?: string;
  quarterId?: string;
}