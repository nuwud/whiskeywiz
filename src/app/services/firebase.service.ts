import { Injectable, Inject } from '@angular/core';
import { 
  Firestore, CollectionReference, collection, 
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, getDocs
} from '@angular/fire/firestore';
import { Analytics } from '@angular/fire/analytics';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Quarter } from '../shared/models/quarter.model';
import { GameState } from '../shared/models/game.model';
import { Score } from '../shared/models/score.model';
import { QuarterStats, PlayerStats } from '../shared/models/analytics.model';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private quartersRef: CollectionReference;
  private gameStatesRef: CollectionReference;
  private scoresRef: CollectionReference;
  private usersRef: CollectionReference;

  constructor(
    @Inject('FIREBASE_FIRESTORE') private firestore: Firestore,
    @Inject('FIREBASE_ANALYTICS') private analytics: Analytics
  ) {
    this.quartersRef = collection(this.firestore, 'quarters');
    this.gameStatesRef = collection(this.firestore, 'gameStates');
    this.scoresRef = collection(this.firestore, 'scores');
    this.usersRef = collection(this.firestore, 'users');
  }

  async getQuarters(): Promise<Quarter[]> {
    const snapshot = await getDocs(this.quartersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quarter));
  }

  async getUserScores(userId?: string): Promise<Score[]> {
    const userFilter = userId ? where('userId', '==', userId) : undefined;
    const q = query(this.scoresRef, ...(userFilter ? [userFilter] : []), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Score);
  }

  getQuarter(quarterId: string): Observable<Quarter | null> {
    return from(getDoc(doc(this.quartersRef, quarterId)))
      .pipe(map(doc => doc.exists() ? doc.data() as Quarter : null));
  }

  async saveQuarter(quarter: Quarter): Promise<void> {
    await setDoc(doc(this.quartersRef, quarter.id), quarter);
  }

  getQuarterStats(): Observable<QuarterStats[]> {
    return from(getDocs(query(collection(this.firestore, 'quarterStats'))))
      .pipe(map(snapshot => snapshot.docs.map(doc => doc.data() as QuarterStats)));
  }

  getPlayerStats(): Observable<PlayerStats[]> {
    return from(getDocs(query(collection(this.firestore, 'playerStats'))))
      .pipe(map(snapshot => snapshot.docs.map(doc => doc.data() as PlayerStats)));
  }

  async submitScore(quarterId: string, score: Score): Promise<void> {
    await setDoc(doc(this.scoresRef), { quarterId, ...score });
  }

  async getAdminDashboardData(): Promise<{
    totalQuarters: number;
    activeQuarters: number;
    topScores: Score[];
  }> {
    const quarters = await this.getQuarters();
    const topScores = await this.getUserScores();
    
    return {
      totalQuarters: quarters.length,
      activeQuarters: quarters.filter(q => (q as any).active).length,
      topScores: topScores.slice(0, 10)
    };
  }

  logEvent(eventName: string, params?: Record<string, any>) {
    this.analytics.logEvent(eventName, params);
  }
}