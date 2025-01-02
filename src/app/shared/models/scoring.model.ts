export interface ScoringRules {
    agePerfectScore: number;
    ageBonus: number;
    agePenaltyPerYear: number;
    proofPerfectScore: number;
    proofBonus: number;
    proofPenaltyPerPoint: number;
    mashbillCorrectScore: number;
  }
  
  export const DEFAULT_SCORING_RULES: ScoringRules = {
    agePerfectScore: 20,
    ageBonus: 10,
    agePenaltyPerYear: 4,
    proofPerfectScore: 20,
    proofBonus: 10,
    proofPenaltyPerPoint: 2,
    mashbillCorrectScore: 10
  };