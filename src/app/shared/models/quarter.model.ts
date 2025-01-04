export interface Sample {
  age: number;
  proof: number;
  mashbill: string;
}

export interface Quarter {
  id: string;
  name: string;
  active: boolean;
  videoUrl?: string;
  samples: {
    [key: string]: Sample;
  };
}

export interface PlayerScore {
  id?: string;
  playerId: string;
  playerName: string;
  score: number;
  quarterId: string;
  timestamp?: any; // Firebase Timestamp
  guesses?: {
    [key: string]: {
      age: number;
      proof: number;
      mashbill: string;
      rating?: number;
    };
  };
}
