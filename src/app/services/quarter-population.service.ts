// src/app/services/quarter-population.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';

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

 async populateQuarters(startYear = 2022) {
   if (this.isPopulating.value) return;

   const confirmedByUser = confirm(
     `This will create ${this.quarters.length} test quarters starting from ${startYear}. ` +
     'Existing quarters with the same IDs will be overwritten. Continue?'
   );

   if (!confirmedByUser) return;

   try {
     this.isPopulating.next(true);
     let populated = 0;

     for (const quarter of this.quarters) {
       const year = startYear + parseInt(quarter.slice(2)) - 22; // Adjust year based on startYear
       const month = quarter.slice(0, 2);
       const startDate = new Date(`${year}-${month}-01`);
       const endDate = new Date(startDate);
       endDate.setMonth(endDate.getMonth() + 3);
       endDate.setDate(0);

       const quarterData: QuarterData = {
         name: `${this.getQuarterName(month)} ${year}`,
         startDate,
         endDate,
         active: false,
         samples: this.generateRandomSamples()
       };

       await this.firestore.doc(`quarters/${quarter}`).set(quarterData);
       populated++;
       console.log(`Created quarter document: ${quarter} (${populated}/${this.quarters.length})`);
     }

     alert(`Successfully populated ${populated} quarters!`);
   } catch (error) {
     console.error('Error populating quarters:', error);
     alert('Error populating quarters. Check console for details.');
   } finally {
     this.isPopulating.next(false);
   }
 }

 private generateRandomSamples(): Record<string, Sample> {
   const samples: Record<string, Sample> = {};
   this.sampleTemplates.forEach((template, index) => {
     samples[`sample${index + 1}`] = {
       mashbill: template.mashbill,
       proof: this.getRandomNumber(...template.proofRange),
       age: this.getRandomNumber(...template.ageRange)
     };
   });
   return samples;
 }

 private getRandomNumber(min: number, max: number): number {
   return Math.floor(Math.random() * (max - min + 1)) + min;
 }

 private getQuarterName(month: string): string {
   const quarterNumber = Math.floor((parseInt(month) - 1) / 3) + 1;
   return `Q${quarterNumber}`;
 }

 // Helper method to check if a quarter exists
 async quarterExists(quarterId: string): Promise<boolean> {
   const doc = await this.firestore.doc(`quarters/${quarterId}`).get().toPromise();
   return doc?.exists || false;
 }
}