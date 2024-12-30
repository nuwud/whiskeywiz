export interface Sample {
  age: number;
  proof: number;
  mashbill: 'Bourbon' | 'Rye' | 'Wheat' | 'Single Malt' | 'Specialty';
  rating?: number;
}

export interface QuarterSamples {
  [key: string]: Sample;
  sample1: Sample;
  sample2: Sample;
  sample3: Sample;
  sample4: Sample;
}

export interface Quarter {
  id?: string;
  name: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
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

export interface GameGuess {
  age: number;
  proof: number;
  mashbill: Sample['mashbill'];
  rating?: number;
}

export interface GameState {
  currentSample: 1 | 2 | 3 | 4;
  guesses: {
    [key: `sample${1|2|3|4}`]: GameGuess;
  };
  isComplete: boolean;
  scores: {
    [key: `sample${1|2|3|4}`]: number;
  };
  totalScore: number;
}

// Validation helpers
export const isValidQuarter = (quarter: unknown): quarter is Quarter => {
  if (!quarter || typeof quarter !== 'object') return false;
  
  const q = quarter as Quarter;
  return (
    typeof q.name === 'string' &&
    typeof q.active === 'boolean' &&
    q.samples !== undefined &&
    typeof q.samples === 'object' &&
    Object.keys(q.samples).length === 4 &&
    Object.entries(q.samples).every(([key, sample]) => 
      key.startsWith('sample') && 
      isValidSample(sample)
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