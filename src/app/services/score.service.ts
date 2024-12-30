import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import { 
  ScoringRules, 
  GameScore, 
  SampleScore, 
  DEFAULT_SCORING_RULES,
  SCORE_QUIPS 
} from '../shared/models/scoring.model';
import { 
  Quarter, 
  Sample, 
  SampleKey,
  GameState,
  GameGuess 
} from '../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private scoringRules$ = new BehaviorSubject<ScoringRules>(DEFAULT_SCORING_RULES);
  private readonly EMOJI_SCORE_THRESHOLDS = [
    { score: 30, emoji: '🟦' },
    { score: 20, emoji: '🟨' },
    { score: 10, emoji: '⬜' },
    { score: 0, emoji: '⬛' }
  ] as const;

  constructor(private firebaseService: FirebaseService) {
    this.loadScoringRules();
  }

  private async loadScoringRules(): Promise<void> {
    try {
      const rules = await firstValueFrom(this.firebaseService.getScoringRules());
      if (rules) {
        this.scoringRules$.next(rules);
      }
    } catch (error) {
      console.error('Error loading scoring rules:', error);
    }
  }

  getScoringRules(): Observable<ScoringRules> {
    return this.scoringRules$.asObservable();
  }

  calculateSampleScore(guess: GameGuess, actual: Sample): SampleScore {
    const rules = this.scoringRules$.value;
    
    const ageDiff = Math.abs(actual.age - guess.age);
    const agePoints = ageDiff === 0 
      ? rules.agePerfectScore + rules.ageBonus
      : Math.max(0, rules.agePerfectScore - (ageDiff * rules.agePenaltyPerYear));

    const proofDiff = Math.abs(actual.proof - guess.proof);
    const proofPoints = proofDiff === 0
      ? rules.proofPerfectScore + rules.proofBonus
      : Math.max(0, rules.proofPerfectScore - (proofDiff * rules.proofPenaltyPerPoint));

    const mashbillPoints = guess.mashbill === actual.mashbill 
      ? rules.mashbillCorrectScore 
      : 0;

    return {
      agePoints,
      proofPoints,
      mashbillPoints,
      total: agePoints + proofPoints + mashbillPoints,
      details: {
        ageAccuracy: ageDiff,
        proofAccuracy: proofDiff,
        mashbillCorrect: guess.mashbill === actual.mashbill
      }
    };
  }

  calculateGameScore(gameState: GameState, quarter: Quarter): GameScore {
    const sampleScores: { [K in SampleKey]: SampleScore } = {
      sample1: this.getInitialSampleScore(),
      sample2: this.getInitialSampleScore(),
      sample3: this.getInitialSampleScore(),
      sample4: this.getInitialSampleScore()
    };

    let totalScore = 0;

    Object.keys(gameState.guesses).forEach((key) => {
      const sampleKey = key as SampleKey;
      const guess = gameState.guesses[sampleKey];
      const actual = quarter.samples[sampleKey];

      const score = this.calculateSampleScore(guess, actual);
      sampleScores[sampleKey] = score;
      totalScore += score.total;
    });

    return {
      totalScore,
      samples: sampleScores,
      quip: this.getScoreQuip(totalScore),
      shareText: this.generateShareText(totalScore, sampleScores)
    };
  }

  private getInitialSampleScore(): SampleScore {
    return {
      agePoints: 0,
      proofPoints: 0,
      mashbillPoints: 0,
      total: 0,
      details: {
        ageAccuracy: 0,
        proofAccuracy: 0,
        mashbillCorrect: false
      }
    };
  }

  private getScoreQuip(score: number): string {
    return SCORE_QUIPS.find(q => score >= q.score)?.text ?? SCORE_QUIPS[SCORE_QUIPS.length - 1].text;
  }

  private getEmojiScore(score: number): string {
    return this.EMOJI_SCORE_THRESHOLDS.find(t => score >= t.score)?.emoji ?? '⬛';
  }

  generateShareText(totalScore: number, sampleScores: { [K in SampleKey]: SampleScore }): string {
    const emojiScores = Object.values(sampleScores).map(score => this.getEmojiScore(score.total));
    const quip = this.getScoreQuip(totalScore);
    return `🥃 Whiskey Wiz Score: ${totalScore}\n${quip}\n${emojiScores.join('')}`;
  }

  getMaxPossibleScore(): number {
    const rules = this.scoringRules$.value;
    const sampleMaxScore = (rules.agePerfectScore + rules.ageBonus) +
      (rules.proofPerfectScore + rules.proofBonus) +
      rules.mashbillCorrectScore;
    return sampleMaxScore * 4;
  }

  async updateScoringRules(rules: ScoringRules): Promise<void> {
    try {
      await firstValueFrom(this.firebaseService.updateScoringRules(rules));
      this.scoringRules$.next(rules);
    } catch (error) {
      console.error('Error updating scoring rules:', error);
      throw error;
    }
  }
}