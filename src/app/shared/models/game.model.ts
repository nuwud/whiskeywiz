export interface SampleGuess {
  age: number;
  proof: number;
  mashbill: string;
  rating?: number;
}

export interface GameState {
  currentSample: 'A' | 'B' | 'C' | 'D';
  guesses: { [key: string]: SampleGuess };
  isComplete: boolean;
  lastUpdated: number;
  quarterId: string;
  totalScore?: number;
}

export interface ScoreResult {
  totalScore: number;
  sampleScores: {
    [key: string]: number;
  };
}

export interface QuarterInfo {
  id: string;
  name: string;
  active: boolean;
  completedBy?: string[];
}
