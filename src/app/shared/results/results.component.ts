import { Component, Input, Output, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { Quarter } from '../models/quarter.model';
import { GameGuess } from '../models/game.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  @Input() quarterData: Quarter | null = null;
  @Input() guesses: {[key: string]: any} = {};
  @Input() scores: {[key: string]: number} = {};
  @Input() totalScore: number = 0;
  @Output() playAgain = new EventEmitter<void>();
  @Output() shareResults = new EventEmitter<void>();
  @Output() submitScore = new EventEmitter<void>();

  submitHovered = false;
  shareHovered = false;
  playAgainHovered = false;
  leaderboardHovered: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router) {}

  getButtonImage(baseName: string, isHovered: boolean): string {
    const suffix = isHovered ? '_Hover' : '';
    return `assets/images/${baseName}${suffix}.png`;
  }

  getResultPanelImage(): string {
    return window.innerWidth <= 768 
      ? 'assets/images/result-panel-mobile.png'
      : 'assets/images/result-panel.png';
  }

  @HostListener('window:resize')
  onResize() {
    // Force re-evaluation of panel image on resize
    this.changeDetectorRef.detectChanges();
  }

  handleShare() {
    this.shareResults.emit();
  }

  handlePlayAgain() {
    const quarterId = this.quarterData?.id || localStorage.getItem('lastPlayedQuarter');
    if (quarterId) {
      this.router.navigate(['/game'], {
        queryParams: { quarter: quarterId },
        replaceUrl: true
      });
    } else {
      // Fallback to default quarter if none found
      this.router.navigate(['/game'], {
        queryParams: { quarter: '0124' } // Use current quarter as default
      });
    }
  }

  handleSubmitScore() {
    this.submitScore.emit();
  }

  handleLeaderboard() {
    this.router.navigate(['/leaderboard'], { 
      queryParams: { quarter: this.quarterData?.id },
      queryParamsHandling: 'merge'  // This will merge new params with existing ones
    });
  }

  navigateWithQuarter(route: string, quarterId: string) {
    this.router.navigate([route], {
      queryParams: { quarter: quarterId },
      queryParamsHandling: 'merge'
    });
  }

  getEmojiScore(score: number): string {
    if (score >= 30) return '🟦';
    if (score >= 20) return '🟨';
    if (score >= 10) return '⬜';
    return '⬛';
  }

  getScoreQuip(score: number): string {
    if (!score) return "🌱 Keep Tasting!";
    if (score >= 240) return "🌟 Master Distiller Status!";
    if (score >= 200) return "🥃 Whiskey Connoisseur!";
    if (score >= 160) return "👍 Solid Palate!";
    if (score >= 120) return "🎯 Good Start!";
    return "🌱 Keep Tasting!";
  }
}
