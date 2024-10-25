// src/app/services/quarter-population.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class QuarterPopulationService {
  private quarters = [
    '0122', '0322', '0622', '0922', '1222',
    '0323', '0623', '0923', '1223',
    '0324', '0624', '0924', '1224',
    '0325', '0625', '0925', '1225',
    '0326', '0626', '0926'
  ];

  constructor(private firestore: AngularFirestore) {}

  async populateQuarters() {
    for (const quarter of this.quarters) {
      const year = '20' + quarter.slice(2);
      const month = quarter.slice(0, 2);
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 3);
      endDate.setDate(0);

      const quarterData = {
        name: `${this.getQuarterName(month)} ${year}`,
        startDate,
        endDate,
        active: false,
        samples: {
          0: { mashbill: "Bourbon", proof: 100, age: 4 },
          1: { mashbill: "Rye", proof: 90, age: 3 },
          2: { mashbill: "Wheat", proof: 92, age: 5 },
          3: { mashbill: "Single Malt", proof: 86, age: 6 }
        }
      };

      await this.firestore.doc(`quarters/${quarter}`).set(quarterData);
      console.log(`Created quarter document: ${quarter}`);
    }
  }

  private getQuarterName(month: string): string {
    const quarterNumber = Math.floor((parseInt(month) - 1) / 3) + 1;
    return `Q${quarterNumber}`;
  }
}