import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { GameService } from './game.service';

export interface ShareableScore {
  quarterId: string;
  totalScore: number;
  sampleScores: {
    [key: string]: {
      ageScore: number;
      proofScore: number;
      mashbillScore: number;
    }
  };
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreSharingService {
  constructor(
    private firebaseService: FirebaseService,
    private gameService: GameService
  ) {}

  // Generate shareable text format (Wordle-style)
  generateShareText(score: ShareableScore): string {
    const quarterName = this.formatQuarterId(score.quarterId);
    const maxScore = 70; // Based on project docs - max possible score
    const percentage = Math.round((score.totalScore / maxScore) * 100);
    
    let shareText = `🥃 Whiskey Wiz ${quarterName}\n`;
    shareText += `Score: ${score.totalScore}/${maxScore} (${percentage}%)\n\n`;
    
    // Generate emoji grid based on sample scores
    Object.entries(score.sampleScores).forEach(([sample, scores]) => {
      const sampleTotal = scores.ageScore + scores.proofScore + scores.mashbillScore;
      const sampleEmoji = this.getScoreEmoji(sampleTotal);
      shareText += `Sample ${sample}: ${sampleEmoji}\n`;
    });
    
    shareText += `\nPlay at whiskeywiz2.web.app/game?quarter=${score.quarterId}`;
    return shareText;
  }

  // Create shareable URL with encoded score data
  generateShareableUrl(score: ShareableScore): string {
    const baseUrl = 'whiskeywiz2.web.app/results';
    const params = new URLSearchParams({
      q: score.quarterId,
      s: score.totalScore.toString(),
      t: score.timestamp.getTime().toString()
    });
    return `${baseUrl}?${params.toString()}`;
  }

  // Save score for social sharing
  async saveShareableScore(score: ShareableScore): Promise<string> {
    const shareId = await this.firebaseService.addDocument('shared_scores', {
      ...score,
      created: new Date()
    });
    return shareId;
  }

  private formatQuarterId(id: string): string {
    const quarter = Math.ceil(parseInt(id.substring(0, 2)) / 3);
    const year = '20' + id.substring(2, 4);
    return `Q${quarter} ${year}`;
  }

  private getScoreEmoji(score: number): string {
    if (score >= 25) return '🟧'; // Excellent
    if (score >= 20) return '🟨'; // Good
    if (score >= 15) return '🟦'; // Fair
    return '⬜'; // Needs improvement
  }
}