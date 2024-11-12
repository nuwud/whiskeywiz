import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="star-rating-container">
      <div>DEBUG: Rating = {{rating}}</div>  <!-- Add this debug line -->
      <div *ngFor="let star of [1,2,3,4,5,6,7,8,9,10]"
           class="star-container"
           [class.filled]="star <= (hoverRating || rating)"
           (mouseenter)="setHoverState(star)"
           (mouseleave)="clearHoverState()"
           (click)="onRatingChange(star)">
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
      margin: 0.25rem 0;
      gap: 0.25rem;
      padding: 0.25rem;
    }
    
    .star-container {
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        transform: scale(1.2);
      }
      
      &.filled svg {
        filter: drop-shadow(0 0 2px #FFD700);
      }
    }
    
    svg {
      width: 24px;
      height: 24px;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  hoverRating: number | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  onRatingChange(value: number): void {
    if (this.readonly) return;
    
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