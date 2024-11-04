// src/app/shared/models/game.model.ts
export interface GameGuess {
    age: number;
    proof: number;
    mashbill: string | null;
  }
  
  export interface GameState {
    currentSample: number;
    guesses: {[key: string]: GameGuess};
    scores: {[key: string]: number};
    totalScore: number;
    isComplete: boolean;
  }
  
  export interface ShareableScore {
    score: number;
    grid: string[];
    emoji: string;
    quarterId: string;
  }
  