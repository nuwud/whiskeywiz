import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SampleGuess, MashbillType, GameState, Sample, SampleScore } from '../shared/models/game.model';

export interface ScoringRules {
  agePoints: number;
  proofPoints: number;
  mashbillPoints: number;
  ageToleranceYears: number;
  proofTolerance: number;
  exactMatchBonus: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScoringService {
  private readonly DEFAULT_SCORING_RULES: ScoringRules = {
    agePoints: 30,
    proofPoints: 30,
    mashbillPoints: 10,
    ageToleranceYears: 5,
    proofTolerance: 10,
    exactMatchBonus: 10
  };

  private scoringRules = new BehaviorSubject<ScoringRules>(this.DEFAULT_SCORING_RULES);

  constructor() {}

  setScoringRules(rules: Partial<ScoringRules>): void {
    this.scoringRules.next({
      ...this.DEFAULT_SCORING_RULES,
      ...rules
    });
  }

  getScoringRules(): Observable<ScoringRules> {
    return this.scoringRules.asObservable();
  }

  calculateSampleScore(guess: SampleGuess, actual: Sample): SampleScore {
    const rules = this.scoringRules.value;
    
    // Calculate individual component scores
    const ageScore = this.calculateAgeScore(guess.age, actual.age, rules);
    const proofScore = this.calculateProofScore(guess.proof, actual.proof, rules);
    const mashbillScore = this.calculateMashbillScore(guess.mashbill, actual.mashbill, rules);

    const total = ageScore + proofScore + mashbillScore;

    return {
      ageScore,
      proofScore,
      mashbillScore,
      total,
      details: {
        ageAccuracy: Math.abs(guess.age - actual.age),
        proofAccuracy: Math.abs(guess.proof - actual.proof),
        mashbillCorrect: guess.mashbill === actual.mashbill
      }
    };
  }

  private calculateAgeScore(guessedAge: number, actualAge: number, rules: ScoringRules): number {
    const difference = Math.abs(guessedAge - actualAge);
    
    // Exact match bonus
    if (difference === 0) {
      return rules.agePoints + rules.exactMatchBonus;
    }

    // Calculate score based on difference
    if (difference > rules.ageToleranceYears) {
      return 0;
    }

    return Math.round(rules.agePoints * (1 - difference / rules.ageToleranceYears));
  }

  private calculateProofScore(guessedProof: number, actualProof: number, rules: ScoringRules): number {
    const difference = Math.abs(guessedProof - actualProof);
    
    // Exact match bonus
    if (difference === 0) {
      return rules.proofPoints + rules.exactMatchBonus;
    }

    // Calculate score based on difference
    if (difference > rules.proofTolerance) {
      return 0;
    }

    return Math.round(rules.proofPoints * (1 - difference / rules.proofTolerance));
  }

  private calculateMashbillScore(guessedMashbill: MashbillType, actualMashbill: MashbillType, rules: ScoringRules): number {
    return guessedMashbill === actualMashbill ? rules.mashbillPoints : 0;
  }

  calculateGameScore(gameState: GameState): number {
    return Object.entries(gameState.scores).reduce((total, [_, sampleScore]) => {
      return total + sampleScore.total;
    }, 0);
  }

  generateScoreSummary(gameState: GameState): string {
    const totalScore = this.calculateGameScore(gameState);
    let summary = `Whiskey Wiz Score: ${totalScore}\n\n`;

    Object.entries(gameState.scores).forEach(([sampleKey, score]) => {
      summary += `Sample ${sampleKey}:\n`;
      summary += `🎯 Age: ${score.details.ageAccuracy} year(s) off\n`;
      summary += `🔥 Proof: ${score.details.proofAccuracy} points off\n`;
      summary += `🌾 Mashbill: ${score.details.mashbillCorrect ? '✓' : '✗'}\n\n`;
    });

    return summary;
  }
}
