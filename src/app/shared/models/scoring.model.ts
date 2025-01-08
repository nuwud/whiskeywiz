export interface ScoringRules {
  age: {
    exactMatch: number;
    withinOne: number;
    perYearPenalty: number;
  };
  proof: {
    exactMatch: number;
    withinTwo: number;
    perPointPenalty: number;
  };
  mashbill: {
    correct: number;
  };
  bonuses: {
    perfectGuess: number;
  };
}

export const DEFAULT_SCORING_RULES: ScoringRules = {
  age: {
    exactMatch: 30,
    withinOne: 20,
    perYearPenalty: 4
  },
  proof: {
    exactMatch: 30,
    withinTwo: 20,
    perPointPenalty: 2
  },
  mashbill: {
    correct: 10
  },
  bonuses: {
    perfectGuess: 10
  }
};