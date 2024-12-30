import { MashbillType, SampleKey } from './quarter.model';

export interface ScoringRules {
  agePerfectScore: number;
  ageBonus: number;
  agePenaltyPerYear: number;
  proofPerfectScore: number;
  proofBonus: number;
  proofPenaltyPerPoint: number;
  mashbillCorrectScore: number;
}

export interface SampleScore {
  agePoints: number;
  proofPoints: number;
  mashbillPoints: number;
  total: number;
  details: {
    ageAccuracy: number;
    proofAccuracy: number;
    mashbillCorrect: boolean;
  };
}

export interface GameScore {
  totalScore: number;
  samples: {
    [K in SampleKey]: SampleScore;
  };
  quip: string;
  shareText: string;
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

export const SCORE_QUIPS = [
  { score: 240, text: "🌟 Master Distiller Status!" },
  { score: 200, text: "🥃 Whiskey Connoisseur!" },
  { score: 160, text: "👍 Solid Palate!" },
  { score: 120, text: "🎯 Good Start!" },
  { score: 0, text: "🌱 Keep Tasting!" }
] as const;

// Type guard
export const isSampleScore = (score: unknown): score is SampleScore => {
  if (!score || typeof score !== 'object') return false;
  
  const s = score as SampleScore;
  return (
    typeof s.agePoints === 'number' &&
    typeof s.proofPoints === 'number' &&
    typeof s.mashbillPoints === 'number' &&
    typeof s.total === 'number' &&
    s.details &&
    typeof s.details.ageAccuracy === 'number' &&
    typeof s.details.proofAccuracy === 'number' &&
    typeof s.details.mashbillCorrect === 'boolean'
  );
};