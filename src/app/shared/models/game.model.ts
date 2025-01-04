export interface GameState {
  quarterId: string;
  currentSample: number;
  guesses: {
    [key: string]: SampleGuess;
  };
  scores: {
    [key: string]: number;
  };
  totalScore: number;
  isComplete: boolean;
  playerId?: string;
}

export interface SampleGuess {
  age: number;
  proof: number;
  mashbill: string;
  rating?: number;
}

export interface GameData {
  quarterId: string;
  playerId?: string;
  guesses: {
    [key: string]: SampleGuess;
  };
  scores: {
    [key: string]: number;
  };
  ratings?: {
    [key: string]: number;
  };
  location?: {
    country: string;
    region: string;
    city: string;
  };
  deviceInfo?: {
    platform: string;
    userAgent: string;
    language: string;
    screenSize: string;
  };
  shopifyCustomerId?: string;
  completionTime?: number;
  timestamp?: string;
}