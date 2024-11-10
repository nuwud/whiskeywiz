// src/app/shared/components/star-rating/star-rating.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="star-rating-container">
      <div *ngFor="let star of [1,2,3,4,5,6,7,8,9,10]"
           class="star-container"
           (click)="onRatingChange(star)"
           (mouseenter)="setHoverState(star)"
           (mouseleave)="clearHoverState()">
        <div class="star-svg" 
             [innerHTML]="getSafeStarHtml(star <= (hoverRating || rating))"
             [class.active]="star <= rating">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .star-rating-container {
      display: flex;
      justify-content: center;
      margin: 1rem 0;
      gap: 0;
     flex-wrap: wrap;
    }
    
    .star-container {
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .star-container:hover {
      transform: scale(1.1);
    }
    
    .star-svg {
      width: 24px;
      height: 24px;
    }
    
    .star-svg.active svg {
      animation: starPop 0.3s ease-out;
    }
    
    @keyframes starPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  hoverRating: number | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  private getSvgStar(filled: boolean): string {
    const fillColor = filled ? '#FFD700' : 'none';
    const strokeColor = '#FFD700';
    
    return `
      <svg xmlns="http://www.w3.org/2000/svg" 
           viewBox="0 0 24 24" 
           width="24" 
           height="24" 
           fill="${fillColor}" 
           stroke="${strokeColor}" 
           stroke-width="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    `;
  }

  getSafeStarHtml(filled: boolean): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getSvgStar(filled));
  }

  onRatingChange(value: number): void {
    if (this.readonly) return;
    this.rating = value;
    this.ratingChange.emit(value);
  }

  setHoverState(value: number): void {
    if (this.readonly) return;
    this.hoverRating = value;
  }

  clearHoverState(): void {
    this.hoverRating = null;
  }
}