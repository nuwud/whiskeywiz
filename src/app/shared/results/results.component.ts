import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Quarter, Sample, SampleLetter, PlayerScore, ShopifyProduct } from '../models/quarter.model';
import { ShopifyService } from '../../services/shopify.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface SampleResult {
  letter: SampleLetter;
  sample: Sample;
  score: number;
  guess: Sample;
  revealed: boolean;
}

interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  @Input() quarter!: Quarter;
  @Input() playerScore!: PlayerScore;

  sampleResults: SampleResult[] = [];
  totalScore = 0;
  revealDate: Date | null = null;
  error: string | null = null;
  isAddingToCart = false;
  canShare = !!navigator.share;
  canShareTwitter = !!(window as any).twttr;

  private readonly destroy$ = new Subject<void>();

  constructor(private shopifyService: ShopifyService) {}

  ngOnInit(): void {
    if (!this.quarter || !this.playerScore) {
      this.error = 'Missing required data';
      return;
    }
    this.initializeResults();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeResults(): void {
    const sampleMap: Record<SampleLetter, Sample> = {
      'A': this.quarter.samples.sample1,
      'B': this.quarter.samples.sample2,
      'C': this.quarter.samples.sample3,
      'D': this.quarter.samples.sample4
    };

    this.sampleResults = Object.entries(sampleMap).map(([letter, sample]) => {
      const guess = this.playerScore?.guesses?.[letter as SampleLetter] || {
        age: 0,
        proof: 0,
        mashbill: 'Unknown'
      } as Sample;

      return {
        letter: letter as SampleLetter,
        sample,
        score: this.calculateSampleScore(guess, sample),
        guess,
        revealed: this.isRevealed(sample)
      };
    });

    this.totalScore = this.calculateTotalScore();
    this.revealDate = this.quarter.revealDate ? new Date(this.quarter.revealDate) : null;
  }

  private calculateSampleScore(guess: Sample, actual: Sample): number {
    let score = 0;
    
    // Mashbill scoring (10 points)
    if (guess.mashbill === actual.mashbill) score += 10;
    
    // Proof scoring (0-30 points)
    const proofDiff = Math.abs(guess.proof - actual.proof);
    if (proofDiff === 0) score += 30;
    else score += Math.max(0, 30 - (proofDiff * 3));
    
    // Age scoring (0-30 points)
    const ageDiff = Math.abs(guess.age - actual.age);
    if (ageDiff === 0) score += 30;
    else score += Math.max(0, 30 - (ageDiff * 6));
    
    return score;
  }

  private calculateTotalScore(): number {
    return this.sampleResults.reduce((total, result) => total + result.score, 0);
  }

  private isRevealed(sample: Sample): boolean {
    if (!this.revealDate) return false;
    if (sample.revealed) return true;
    return new Date() >= this.revealDate;
  }

  getScoreMessage(): string {
    if (this.totalScore >= 70) return 'Whiskey God! Perfect Score! 🏆';
    if (this.totalScore >= 60) return 'Whiskey Master! 🥃';
    if (this.totalScore >= 50) return 'Whiskey Expert! 👍';
    if (this.totalScore >= 40) return 'Getting There! 💪';
    if (this.totalScore >= 30) return 'Keep Practicing! 📚';
    return 'Nice Try! 🎯';
  }

  addToCart(product: ShopifyProduct): void {
    if (!product.variantId) {
      this.error = 'Product variant not found';
      return;
    }

    this.isAddingToCart = true;
    this.shopifyService.addToCart(product.variantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isAddingToCart = false;
          // Optional: Show success message
        },
        error: (err) => {
          this.isAddingToCart = false;
          this.error = 'Failed to add to cart. Please try again.';
          console.error('Add to cart error:', err);
        }
      });
  }

  async shareResults(method: 'clipboard' | 'native' | 'twitter'): Promise<void> {
    const shareText = this.generateShareText();
    const shareOptions: ShareOptions = {
      title: 'WhiskeyWiz Score',
      text: shareText,
      url: 'https://whiskeywiz2.web.app'
    };

    try {
      switch (method) {
        case 'clipboard':
          await navigator.clipboard.writeText(shareText);
          // Optional: Show success message
          break;

        case 'native':
          if (navigator.share) {
            await navigator.share(shareOptions);
          }
          break;

        case 'twitter':
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
          window.open(twitterUrl, '_blank');
          break;
      }
    } catch (err) {
      console.error('Share error:', err);
      this.error = 'Failed to share results. Please try again.';
    }
  }

  private generateShareText(): string {
    const emojiMap = (score: number): string => {
      if (score >= 70) return '🏆';
      if (score >= 50) return '🥃';
      if (score >= 30) return '👍';
      return '🎯';
    };

    const sampleResults = this.sampleResults
      .map(result => emojiMap(result.score))
      .join('');

    return `WhiskeyWiz ${this.quarter.name}\nScore: ${this.totalScore}/70 ${emojiMap(this.totalScore)}\n${sampleResults}\nPlay at whiskeywiz2.web.app`;
  }
}