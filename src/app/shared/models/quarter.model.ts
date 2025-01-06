export interface GameState {
  id: string;
  name: string;
  currentSample: 'A' | 'B' | 'C' | 'D';
  guesses: {
    [key: string]: {
      age: number;
      proof: number;
      mashbill: string;
    };
  };
  status: string;
  lastUpdated: number;
}

export interface Sample {
  id: string;
  age: number;
  proof: number;
  mashbill: string;
  rating?: number;
}

export interface Quarter {
  id: string;
  name: string;
  active: boolean;
  samples: Sample[];
}
