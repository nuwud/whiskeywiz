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
      display: flex;
      gap: 0px;
    }
    
    .star-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 24px;
      padding: 0;
      opacity: 0.3;
      transition: all 0.2s ease;
    }
    
    .star-button.filled {
      opacity: 1;
    }
    .star-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .star {
        font-size: 24px;
        cursor: pointer;
        padding: 8px;
        
        &.selected {
          color: #FFD700;
        }
      }
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