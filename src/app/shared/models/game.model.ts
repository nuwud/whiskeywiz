export interface GameGuess {
  age: number;
  proof: number;
  mashbill: string;
  rating?: number;
}

export interface GameState {
  currentSample: string;
  guesses: {
    [key: string]: GameGuess;
  };
  scores: {
    [key: string]: number;
  };
  totalScore: number;
  isComplete: boolean;
}
