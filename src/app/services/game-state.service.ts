import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { DataCollectionService } from './data-collection.service';

export interface GameState {
    quarterId: string;
    currentSample: 'A' | 'B' | 'C' | 'D';
    guesses: {
        [key: string]: {
            age: number;
            proof: number;
            mashbill: string;
            rating?: number;
            timestamp: Date;
        };
    };
    isComplete: boolean;
    totalScore?: number;
}

@Injectable({
    providedIn: 'root'
})
export class GameStateService {
    private gameState = new BehaviorSubject<GameState | null>(null);
    gameState$ = this.gameState.asObservable();

    constructor(
        private router: Router,
        private dataCollection: DataCollectionService
    ) { }

    async initializeGame(quarterId: string): Promise<void> {
        await this.dataCollection.initializeSession(quarterId);

        this.gameState.next({
            quarterId,
            currentSample: 'A',
            guesses: {},
            isComplete: false
        });
    }

    async recordGuess(sample: string, guess: {
        age: number,
        proof: number,
        mashbill: string,
        rating?: number
    }): Promise<void> {
        const currentState = this.gameState.value;
        if (!currentState) return;

        const startTime = currentState.guesses[sample]?.timestamp || new Date();
        const timeTaken = new Date().getTime() - startTime.getTime();

        // Update local state
        currentState.guesses[sample] = {
            ...guess,
            timestamp: new Date()
        };

        // Record in analytics
        await this.dataCollection.recordGuess(sample, {
            ...guess,
            timeTaken
        });

        this.gameState.next(currentState);
    }

    async completeGame(totalScore: number): Promise<void> {
        const currentState = this.gameState.value;
        if (!currentState) return;

        currentState.isComplete = true;
        currentState.totalScore = totalScore;

        await this.dataCollection.finalizeSession(totalScore, false);

        // Navigate to reveal page with state
        this.router.navigate(['/reveal'], {
            queryParams: {
                quarter: currentState.quarterId,
                score: totalScore
            }
        });

        this.gameState.next(currentState);
    }

    async shareResults(): Promise<void> {
        const currentState = this.gameState.value;
        if (!currentState || !currentState.totalScore) return;

        await this.dataCollection.finalizeSession(
            currentState.totalScore,
            true
        );
    }

    getCurrentState(): GameState | null {
        return this.gameState.value;
    }

    clearState(): void {
        this.gameState.next(null);
    }
}