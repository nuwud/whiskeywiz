import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private readonly mmyyPattern = /^(0[1-9]|1[0-2])(2[0-9]|[3-9][0-9])$/;

  validateQuarter(quarterId: string): { isValid: boolean; message?: string } {
    if (!quarterId) return { isValid: false, message: 'Quarter ID required' };
    
    if (!this.mmyyPattern.test(quarterId)) {
      return { isValid: false, message: 'Invalid format. Use MMYY (e.g., 0124)' };
    }
    
    return { isValid: true };
  }

  formatQuarter(mmyy: string): string {
    if (!mmyy || mmyy.length !== 4) return mmyy;
    const month = parseInt(mmyy.substring(0, 2));
    const year = '20' + mmyy.substring(2, 4);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[month - 1]} ${year}`;
  }

  validateScore(score: number): { isValid: boolean; message?: string } {
    if (typeof score !== 'number') return { isValid: false, message: 'Score must be a number' };
    if (score < 0 || score > 100) return { isValid: false, message: 'Score must be between 0 and 100' };
    return { isValid: true };
  }
}

// FOR_CLAUDE: Validation patterns synchronized with admin implementation