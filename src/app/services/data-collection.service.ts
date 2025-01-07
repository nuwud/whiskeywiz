import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataCollectionService {
  logError(message: string): void {
    // Add your error logging logic here
    console.error(`[DataCollection] ${message}`);
    // You might want to send this to your analytics service
  }
}