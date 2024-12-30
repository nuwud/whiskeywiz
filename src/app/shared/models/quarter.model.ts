// Sample Types
export type MashbillType = 'Bourbon' | 'Rye' | 'Wheat' | 'Single Malt' | 'Specialty';

export interface Sample {
  age: number;
  proof: number;
  mashbill: MashbillType;
  rating?: number;
}

export type SampleKey = 'sample1' | 'sample2' | 'sample3' | 'sample4';

export interface QuarterSamples {
  [K in SampleKey]: Sample;
}

export interface Quarter {
  id?: string;
  name: string;  // Format: "Q1 2024"
  active: boolean;
  startDate?: string;
  endDate?: string;
  samples: QuarterSamples;
}

// Game Types
export interface GameGuess {
  age: number;
  proof: number;
  mashbill: MashbillType;
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
    [K in SampleKey]: GameGuess;
  };
  scores: {
    [K in SampleKey]: SampleScore;
  };
  isComplete: boolean;
  totalScore: number;
  startTime: Date;
  lastUpdated: Date;
}

// Score Types
export interface PlayerScore {
  id?: string;
  playerId: string;
  playerName: string;
  score: number;
  quarterId: string;
  isGuest: boolean;
  timestamp?: Date;
}

// Scoring Rules
export interface ScoringRules {
  agePerfectScore: number;
  ageBonus: number;
  agePenaltyPerYear: number;
  proofPerfectScore: number;
  proofBonus: number;
  proofPenaltyPerPoint: number;
  mashbillCorrectScore: number;
}

// Validation Helpers
export const isValidQuarter = (quarter: unknown): quarter is Quarter => {
  if (!quarter || typeof quarter !== 'object') return false;
  
  const q = quarter as Quarter;
  return (
    typeof q.name === 'string' &&
    typeof q.active === 'boolean' &&
    q.samples !== undefined &&
    typeof q.samples === 'object' &&
    Object.keys(q.samples).length === 4 &&
    ['sample1', 'sample2', 'sample3', 'sample4'].every(key => 
      isValidSample(q.samples[key as SampleKey])
    )
  );
};

export const isValidSample = (sample: unknown): sample is Sample => {
  if (!sample || typeof sample !== 'object') return false;
  
  const s = sample as Sample;
  return (
    typeof s.age === 'number' &&
    typeof s.proof === 'number' &&
    ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Specialty'].includes(s.mashbill)
  );
};

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

// Factory Functions
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