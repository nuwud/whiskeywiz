import { CollectionReference, QueryConstraint } from '@angular/fire/firestore';

export const DB_CONFIG = {
  collections: {
    quarters: 'quarters',
    scores: 'scores',
    players: 'players',
    gameState: 'gameState'
  },
  indices: {
    quarters: {
      active: true,
      startDate: true
    },
    scores: {
      quarterId: true,
      score: true
    }
  }
};

export const GAME_RULES = {
  scoring: {
    age: {
      max: 30,
      pointsPerYear: 2,
      exactBonus: 10
    },
    proof: {
      max: 30,
      pointsPer: 3,
      exactBonus: 10
    },
    mashbill: {
      correct: 10
    }
  },
  validation: {
    age: {
      min: 0,
      max: 30
    },
    proof: {
      min: 80,
      max: 160
    }
  }
};

export interface FirestoreQuery {
  collection: string;
  constraints?: QueryConstraint[];
  orderBy?: string;
  limit?: number;
}

export const createQuery = (
  collection: string,
  constraints: QueryConstraint[] = [],
  orderBy?: string,
  limit?: number
): FirestoreQuery => ({
  collection,
  constraints,
  orderBy,
  limit
});

export const CACHE_CONFIG = {
  quarters: {
    maxAge: 5 * 60 * 1000, // 5 minutes
    prefetch: true
  },
  scores: {
    maxAge: 60 * 1000, // 1 minute
    prefetch: false
  }
};