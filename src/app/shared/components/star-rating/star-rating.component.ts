// src/app/shared/components/star-rating/star-rating.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="star-rating-container">
      <div *ngFor="let star of [1,2,3,4,5,6,7,8,9,10]"
           class="star-container"
           [class.filled]="star <= (hoverRating || rating)"
           (mouseenter)="setHoverState(star)"
           (mouseleave)="clearHoverState()"
           (click)="!readonly && onRatingChange(star)">
        <svg xmlns="http://www.w3.org/2000/svg" 
             viewBox="0 0 24 24" 
             width="24" 
             height="24"
             [attr.fill]="star <= (hoverRating || rating) ? '#FFD700' : 'none'"
             stroke="#FFD700"
             stroke-width="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    .star-rating-container {
      display: flex;
      justify-content: center;
      margin: 0.25rem 0;
      gap: 0;
    }
    
    .star-container {
      cursor: pointer;
      transition: transform 0.2s ease;
      padding: 0.25rem;
    }
    
    .star-container:hover {
      transform: scale(1.1);
    }

    .star-container.filled svg {
      filter: brightness(1.2);
    }
    
    :host([readonly]) .star-container {
      cursor: default;
      pointer-events: none;
    }

    :host([readonly]) .star-container:hover {
      transform: none;
    }
    
    .star-svg {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .star-svg.active svg {
      animation: starPop 0.3s ease-out;
    }
    
    @keyframes starPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    /* Disable hover effects when readonly */
    :host([readonly]) .star-container {
      cursor: default;
    }
  
    :host([readonly]) .star-container:hover {
      transform: none;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  hoverRating: number | null = null;

  ngOnInit() {
    console.log('StarRating initialized with:', this.rating);
  }

  constructor(private sanitizer: DomSanitizer,
              @Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef
  ) {}

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

    console.log('Rating changed to:', value);
    this.rating = value;
    this.ratingChange.emit(value);
    this.cdr.detectChanges();
  }

  setHoverState(value: number): void {
    if (this.readonly) return;
    this.hoverRating = value;
    this.cdr.detectChanges();
  }

  clearHoverState(): void {
    this.hoverRating = null;
    this.cdr.detectChanges();
  }
}