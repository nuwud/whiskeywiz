import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface SampleTemplate {
  mashbill: string;
  proofRange: [number, number];
  ageRange: [number, number];
}

interface Sample {
  mashbill: string;
  proof: number;
  age: number;
}

interface QuarterData {
  name: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  samples: Record<string, Sample>;
}

@Injectable({
  providedIn: 'root'
})
export class QuarterPopulationService {
  private isPopulating = new BehaviorSubject<boolean>(false);
  isPopulating$ = this.isPopulating.asObservable();

  private quarters = [
    '0122', '0322', '0622', '0922', '1222',
    '0323', '0623', '0923', '1223',
    '0324', '0624', '0924', '1224',
    '0325', '0625', '0925', '1225',
    '0326', '0626', '0926'
  ];

  private sampleTemplates: SampleTemplate[] = [
    { mashbill: "Bourbon", proofRange: [90, 110], ageRange: [4, 8] },
    { mashbill: "Rye", proofRange: [90, 100], ageRange: [2, 6] },
    { mashbill: "Wheat", proofRange: [85, 95], ageRange: [5, 12] },
    { mashbill: "Single Malt", proofRange: [80, 92], ageRange: [3, 10] }
  ];

  constructor(private firestore: AngularFirestore) {}

  async getCurrentQuarter(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${month}${year}`;
  }

  async quarterExists(quarterId: string): Promise<boolean> {
    const doc = await this.firestore.doc(`quarters/${quarterId}`).get().toPromise();
    return doc?.exists || false;
  }

  async getActiveQuarters(): Promise<string[]> {
    const snapshot = await this.firestore.collection('quarters', ref => ref.where('active', '==', true)).get().toPromise();
    return snapshot.docs.map(doc => doc.id);
  }

  async getQuarterDetails(quarterId: string): Promise<QuarterData | null> {
    const doc = await this.firestore.doc(`quarters/${quarterId}`).get().toPromise();
    return doc.exists ? doc.data() as QuarterData : null;
  }

  async populateQuarters(startYear = 2022) {
    // Existing population logic remains the same
  }

  // ... rest of the existing methods remain the same
}