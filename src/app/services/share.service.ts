import { Injectable } from '@angular/core';
import { GameState } from './state-manager.service';

export interface ShareConfig {
  score: number;
  quarterId: string;
  guesses: GameState['guesses'];
}

@Injectable({ providedIn: 'root' })
export class ShareService {
  private readonly BASE_URL = 'https://whiskeywiz2.web.app/game';

  constructor() {}

  generateShareText(config: ShareConfig): string {
    const { score, quarterId } = config;
    const maxScore = 70;
    
    const scorePercentage = (score / maxScore) * 100;
    const emojiGrid = this.generateEmojiGrid(scorePercentage);
    
    return `🥃 WhiskeyWiz ${quarterId} Score: ${score}/${maxScore}\n\n${emojiGrid}\n\nPlay now: ${this.BASE_URL}?quarter=${quarterId}`;
  }

  private generateEmojiGrid(scorePercentage: number): string {
    const grid: string[] = [];
    const total = 25;
    const filledSquares = Math.round((scorePercentage / 100) * total);
    
    for (let i = 0; i < total; i++) {
      if (i < filledSquares) {
        grid.push('🟨');
      } else {
        grid.push('⬛');
      }
      
      if ((i + 1) % 5 === 0) {
        grid.push('\n');
      }
    }
    
    return grid.join('');
  }

  async shareScore(config: ShareConfig): Promise<boolean> {
    const shareText = this.generateShareText(config);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'WhiskeyWiz Score',
          text: shareText,
          url: `${this.BASE_URL}?quarter=${config.quarterId}`
        });
        return true;
      } else {
        await navigator.clipboard.writeText(shareText);
        return true;
      }
    } catch (error) {
      console.error('Error sharing score:', error);
      return false;
    }
  }

  generateDetailedResults(config: ShareConfig): string {
    const { guesses, score, quarterId } = config;
    let details = `WhiskeyWiz ${quarterId} Detailed Results:\n\n`;
    
    Object.entries(guesses).forEach(([sample, guess]) => {
      details += `Sample ${sample}:\n`;
      details += `Age: ${guess.age} years\n`;
      details += `Proof: ${guess.proof}°\n`;
      details += `Mashbill: ${guess.mashbill}\n\n`;
    });
    
    details += `Final Score: ${score}/70\n`;
    details += `Can you beat my score? ${this.BASE_URL}?quarter=${quarterId}`;
    
    return details;
  }

  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }
}