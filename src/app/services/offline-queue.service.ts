import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { ValidationService } from './validation.service';
import { BehaviorSubject, Observable } from 'rxjs';

interface QueuedScore {
  quarterId: string;
  score: number;
  timestamp: number;
  retryCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineQueueService {
  private readonly QUEUE_KEY = 'whiskeywiz_score_queue';
  private readonly MAX_RETRIES = 3;
  private processingQueue = false;
  private queue: QueuedScore[] = [];
  private queueStatus$ = new BehaviorSubject<{ pending: number }>({ pending: 0 });

  constructor(
    private firebaseService: FirebaseService,
    private validationService: ValidationService
  ) {
    this.loadQueue();
    window.addEventListener('online', () => this.processQueue());
  }

  private loadQueue(): void {
    const savedQueue = localStorage.getItem(this.QUEUE_KEY);
    if (savedQueue) {
      this.queue = JSON.parse(savedQueue);
      this.updateStatus();
    }
  }

  private saveQueue(): void {
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.queue));
    this.updateStatus();
  }

  private updateStatus(): void {
    this.queueStatus$.next({ pending: this.queue.length });
  }

  getQueueStatus(): Observable<{ pending: number }> {
    return this.queueStatus$.asObservable();
  }

  async enqueueScore(quarterId: string, score: number): Promise<void> {
    // Validate before queuing
    const quarterValid = this.validationService.validateQuarter(quarterId);
    const scoreValid = this.validationService.validateScore(score);

    if (!quarterValid.isValid) {
      throw new Error(quarterValid.message);
    }
    if (!scoreValid.isValid) {
      throw new Error(scoreValid.message);
    }

    this.queue.push({
      quarterId,
      score,
      timestamp: Date.now(),
      retryCount: 0
    });

    this.saveQueue();

    // Try to process immediately if online
    if (navigator.onLine) {
      await this.processQueue();
    }
  }

  async processQueue(): Promise<void> {
    if (this.processingQueue || this.queue.length === 0) return;

    this.processingQueue = true;

    try {
      const currentQueue = [...this.queue];
      for (const item of currentQueue) {
        try {
          await this.firebaseService.submitScore(item.quarterId, item.score);
          // Remove successfully submitted score
          this.queue = this.queue.filter(q => 
            q.quarterId !== item.quarterId || 
            q.timestamp !== item.timestamp
          );
        } catch (error) {
          item.retryCount++;
          if (item.retryCount >= this.MAX_RETRIES) {
            // Remove failed items that exceeded retry limit
            this.queue = this.queue.filter(q => 
              q.quarterId !== item.quarterId || 
              q.timestamp !== item.timestamp
            );
          }
        }
      }
    } finally {
      this.processingQueue = false;
      this.saveQueue();
    }
  }

  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
  }
}

// FOR_CLAUDE: Offline queue with retry mechanism for score submission