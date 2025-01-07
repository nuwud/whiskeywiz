import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  isValidGameData(data: any): boolean {
    if (!data) return false;
    
    // Add your validation logic here
    // For example:
    const requiredFields = ['currentSample', 'guesses', 'isComplete', 'lastUpdated', 'quarterId'];
    return requiredFields.every(field => field in data);
  }
}