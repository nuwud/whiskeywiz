import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { ScoringRules, Quarter, Sample } from '../shared/models/quarter.model';
import { GameGuess } from '../shared/models/game.model';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScoreService {
    private scoringRules$ = new BehaviorSubject<ScoringRules>({
        agePerfectScore: 20,
        ageBonus: 10,
        agePenaltyPerYear: 4,
        proofPerfectScore: 20,
        proofBonus: 10,
        proofPenaltyPerPoint: 2,
        mashbillCorrectScore: 10
    });

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

    calculateSampleScore(guess: GameGuess, actual: Sample): number {
        if (!guess || !actual) return 0;

        const rules = this.scoringRules$.value;
        let score = 0;

        // Age scoring
        const ageDiff = Math.abs(actual.age - (guess.age || 0));
        if (ageDiff === 0) {
            score += rules.agePerfectScore + rules.ageBonus;
        } else {
            score += Math.max(0, rules.agePerfectScore - (ageDiff * rules.agePenaltyPerYear));
        }

        // Proof scoring
        const proofDiff = Math.abs(actual.proof - (guess.proof || 0));
        if (proofDiff === 0) {
            score += rules.proofPerfectScore + rules.proofBonus;
        } else {
            score += Math.max(0, rules.proofPerfectScore - (proofDiff * rules.proofPenaltyPerPoint));
        }

        // Mashbill scoring
        if (guess.mashbill === actual.mashbill) {
            score += rules.mashbillCorrectScore;
        }

        return score;
    }

    calculateTotalScore(guesses: { [key: string]: GameGuess }, quarterData: Quarter): {
        sampleScores: { [key: string]: number },
        totalScore: number
    } {
        const sampleScores: { [key: string]: number } = {};
        let totalScore = 0;

        for (let i = 1; i <= 4; i++) {
            const sampleKey = `sample${i}`;
            const guess = guesses[sampleKey];
            const actual = quarterData.samples[sampleKey];

            if (guess && actual) {
                const score = this.calculateSampleScore(guess, actual);
                sampleScores[sampleKey] = score;
                totalScore += score;
            }
        }

        return { sampleScores, totalScore };
    }

    getScoreQuip(score: number): string {
        if (!score) return "🌱 Keep Tasting!";
        if (score >= 240) return "🌟 Master Distiller Status!";
        if (score >= 200) return "🥃 Whiskey Connoisseur!";
        if (score >= 160) return "👍 Solid Palate!";
        if (score >= 120) return "🎯 Good Start!";
        return "🌱 Keep Tasting!";
    }

    getEmojiScore(score: number): string {
        if (score >= 30) return '🟦'; // High score
        if (score >= 20) return '🟨'; // Medium score
        if (score >= 10) return '⬜'; // Low score
        return '⬛';                  // Very low score
    }

    generateShareText(totalScore: number, sampleScores: { [key: string]: number }): string {
        const emojiScores = Object.values(sampleScores).map(score => this.getEmojiScore(score));
        const quip = this.getScoreQuip(totalScore);
        return `🥃 Whiskey Wiz Score: ${totalScore}\n${quip}\n${emojiScores.join('')}`;
    }

    getMaxPossibleScore(): number {
        const rules = this.scoringRules$.value;
        const sampleMaxScore = (rules.agePerfectScore + rules.ageBonus) +
            (rules.proofPerfectScore + rules.proofBonus) +
            rules.mashbillCorrectScore;
        return sampleMaxScore * 4; // 4 samples total
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