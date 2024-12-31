export interface ScoringRules {
    agePoints: {
        exact: number;
        perYear: number;
        maxPoints: number;
    };
    proofPoints: {
        exact: number;
        perProof: number;
        maxPoints: number;
    };
    mashbillPoints: {
        correct: number;
        bonus: number;
    };
}

export const DEFAULT_SCORING_RULES: ScoringRules = {
    agePoints: {
        exact: 30,
        perYear: 6,
        maxPoints: 30
    },
    proofPoints: {
        exact: 30,
        perProof: 3,
        maxPoints: 30
    },
    mashbillPoints: {
        correct: 10,
        bonus: 10
    }
};