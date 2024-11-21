// star-rating.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="star-rating-container">
      <button *ngFor="let star of stars" 
              class="star-button"
              [class.filled]="star <= (hoverRating || rating)"
              (mouseenter)="hoverRating = star"
              (mouseleave)="hoverRating = 0"
              (click)="setRating(star)">
        ⭐
      </button>
    </div>
  `,
  styles: [`
.star-rating-container {
  display: grid;
  grid-template-columns: repeat(10, auto);
  gap: 4px;
  justify-content: start;
  align-items: center;
  position: relative;
  margin: 0.5rem 0;
  
  .star-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    font-size: 24px;
    line-height: 1;
    color: rgba(255, 215, 0, 0.3); // Dimmed gold
    transition: all 0.2s ease;
    
    &.filled {
      color: #FFD700; // Bright gold
    }
    
    &:hover {
      transform: scale(1.1);
    }
  }
}

.rating-value {
  font-family: Hermona, sans-serif;
  color: #FFD700;
  margin-left: 1rem;
}

  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  hoverRating: number = 0;

  setRating(value: number) {
    if (this.readonly) return;
    this.rating = value;
    this.ratingChange.emit(value);
  }
}