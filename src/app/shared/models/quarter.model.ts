// src/app/shared/models/quarter.model.ts
export interface Sample {
  age: number;
  proof: number;
  mashbill: 'Bourbon' | 'Rye' | 'Wheat' | 'Single Malt' | 'Specialty'; 
  rating?: number;
}

export interface QuarterSamples {
  [key: string]: Sample;  // Allow string indexing
  sample1: Sample;
  sample2: Sample;
  sample3: Sample;
  sample4: Sample;
}

export interface Quarter {
  id?: string;
  name: string;
  active: boolean;
  startDate?: string;  // Add this based on your Firestore data
  endDate?: string;    // Add this based on your Firestore data
  samples: QuarterSamples;
}

export interface PlayerScore {
  id?: string;
  playerId: string;
  playerName: string;
  score: number;
  quarterId: string;
  isGuest: boolean;
  timestamp?: Date;
}

export interface ScoringRules {
  agePerfectScore: number;
  ageBonus: number;
  agePenaltyPerYear: number;
  proofPerfectScore: number;
  proofBonus: number;
  proofPenaltyPerPoint: number;
  mashbillCorrectScore: number;
}

export interface GameState {
  currentSample: number;
  guesses: {[key: string]: any};
  isComplete: boolean;
  scores: {[key: string]: number};
  totalScore: number;
}