export interface ScoringRules {
  age: {
    exactMatch: number;
    perYearPenalty: number;
    maxYearsOff: number;
  };
  proof: {
    exactMatch: number;
    perPointPenalty: number;
    maxPointsOff: number;
  };
  mashbill: {
    correctGuess: number;
  };
  bonuses: {
    perfectScore: number;
  };
}
