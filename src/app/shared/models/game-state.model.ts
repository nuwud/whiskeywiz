import { Sample } from './quarter.model';

export interface GameGuess {
  age: number;
  proof: number;
  mashbill: Sample['mashbill'];
  rating?: number;
}

export interface SampleScore {
  agePoints: number;
  proofPoints: number;
  mashbillPoints: number;
  total: number;
}

export interface GameState {
  quarterId: string;
  currentSample: 1 | 2 | 3 | 4;
  guesses: {
    [K in `sample${1|2|3|4}`]: GameGuess;
  };
  scores: {
    [K in `sample${1|2|3|4}`]: SampleScore;
  };
  isComplete: boolean;
  totalScore: number;
  startTime: Date;
  lastUpdated: Date;
}

export const createInitialGameState = (quarterId: string): GameState => ({
  quarterId,
  currentSample: 1,
  guesses: {
    sample1: { age: 0, proof: 0, mashbill: 'Bourbon' },
    sample2: { age: 0, proof: 0, mashbill: 'Bourbon' },
    sample3: { age: 0, proof: 0, mashbill: 'Bourbon' },
    sample4: { age: 0, proof: 0, mashbill: 'Bourbon' }
  },
  scores: {
    sample1: { agePoints: 0, proofPoints: 0, mashbillPoints: 0, total: 0 },
    sample2: { agePoints: 0, proofPoints: 0, mashbillPoints: 0, total: 0 },
    sample3: { agePoints: 0, proofPoints: 0, mashbillPoints: 0, total: 0 },
    sample4: { agePoints: 0, proofPoints: 0, mashbillPoints: 0, total: 0 }
  },
  isComplete: false,
  totalScore: 0,
  startTime: new Date(),
  lastUpdated: new Date()
});

export const isValidGameState = (state: unknown): state is GameState => {
  if (!state || typeof state !== 'object') return false;
  
  const s = state as GameState;
  return (
    typeof s.quarterId === 'string' &&
    [1, 2, 3, 4].includes(s.currentSample) &&
    typeof s.isComplete === 'boolean' &&
    typeof s.totalScore === 'number' &&
    s.guesses !== undefined &&
    s.scores !== undefined &&
    Object.keys(s.guesses).length === 4 &&
    Object.keys(s.scores).length === 4 &&
    s.startTime instanceof Date &&
    s.lastUpdated instanceof Date
  );
};