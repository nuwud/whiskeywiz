import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';

export interface GameState {
  currentSample: 'A' | 'B' | 'C' | 'D';
  guesses: {
    [key: string]: {
      age: number;
      proof: number;
      mashbill: string;
    };
  };
  isComplete: boolean;
  lastUpdated: number;
  quarterId: string;
}

export interface StateSnapshot {
  state: GameState;
  timestamp: number;
  version: number;
}

@Injectable({ providedIn: 'root' })
export class StateManagerService {
  private readonly SNAPSHOT_KEY = 'whiskeywiz_state_snapshot';
  private readonly STATE_VERSION = 1;
  private readonly MAX_SNAPSHOTS = 5;

  private state$ = new BehaviorSubject<GameState | null>(null);
  private snapshots: StateSnapshot[] = [];

  constructor(private firebaseService: FirebaseService) {
    this.loadInitialState();
  }

  private async loadInitialState(): Promise<void> {
    try {
      // Try to load from local storage first
      const savedState = this.loadFromLocalStorage();
      if (savedState) {
        this.state$.next(savedState);
        return;
      }

      // If no local state, try to load from Firebase
      const firebaseState = await this.firebaseService.loadLatestGameState();
      if (firebaseState) {
        this.state$.next(firebaseState);
        this.saveSnapshot(firebaseState);
      }
    } catch (error) {
      console.error('Error loading initial state:', error);
      // Initialize empty state if all else fails
      this.initializeEmptyState();
    }
  }

  private initializeEmptyState(): void {
    const emptyState: GameState = {
      currentSample: 'A',
      guesses: {},
      isComplete: false,
      lastUpdated: Date.now(),
      quarterId: ''
    };
    this.state$.next(emptyState);
    this.saveSnapshot(emptyState);
  }

  private saveSnapshot(state: GameState): void {
    const snapshot: StateSnapshot = {
      state: { ...state },
      timestamp: Date.now(),
      version: this.STATE_VERSION
    };

    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.MAX_SNAPSHOTS) {
      this.snapshots.shift(); // Remove oldest snapshot
    }

    // Save latest to localStorage
    localStorage.setItem(this.SNAPSHOT_KEY, JSON.stringify(snapshot));
  }

  private loadFromLocalStorage(): GameState | null {
    try {
      const savedSnapshot = localStorage.getItem(this.SNAPSHOT_KEY);
      if (savedSnapshot) {
        const snapshot: StateSnapshot = JSON.parse(savedSnapshot);
        if (snapshot.version === this.STATE_VERSION) {
          return snapshot.state;
        }
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
    return null;
  }

  async updateState(updates: Partial<GameState>): Promise<void> {
    try {
      const currentState = this.state$.value;
      if (!currentState) {
        throw new Error('No current state available');
      }

      const newState = {
        ...currentState,
        ...updates,
        lastUpdated: Date.now()
      };

      // Save to Firebase first
      await this.firebaseService.saveGameState(newState);
      
      // If Firebase save successful, update local state
      this.state$.next(newState);
      this.saveSnapshot(newState);
    } catch (error) {
      console.error('Error updating state:', error);
      throw error;
    }
  }

  async recoverState(): Promise<boolean> {
    if (this.snapshots.length === 0) {
      return false;
    }

    try {
      // Get most recent snapshot
      const latestSnapshot = this.snapshots[this.snapshots.length - 1];
      
      // Verify snapshot validity
      if (this.isValidSnapshot(latestSnapshot)) {
        this.state$.next(latestSnapshot.state);
        await this.firebaseService.saveGameState(latestSnapshot.state);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error recovering state:', error);
      return false;
    }
  }

  private isValidSnapshot(snapshot: StateSnapshot): boolean {
    return (
      snapshot &&
      snapshot.version === this.STATE_VERSION &&
      snapshot.state &&
      typeof snapshot.state.currentSample === 'string' &&
      typeof snapshot.state.guesses === 'object'
    );
  }

  getState(): Observable<GameState | null> {
    return this.state$.asObservable();
  }

  getCurrentSample(): Observable<string> {
    return this.state$.pipe(
      map(state => state?.currentSample || 'A'),
      distinctUntilChanged()
    );
  }

  getGuesses(): Observable<GameState['guesses']> {
    return this.state$.pipe(
      map(state => state?.guesses || {}),
      distinctUntilChanged()
    );
  }

  cleanup(): void {
    try {
      const currentState = this.state$.value;
      if (currentState) {
        this.saveSnapshot(currentState);
      }
      this.state$.complete();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}