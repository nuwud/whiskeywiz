import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-banner',
  template: `
    <div class="game-banner" [class.expanded]="isExpanded">
      <div class="banner-header" (click)="toggleExpand()">
        <h2>{{ quarterName }} Whiskey Challenge</h2>
      </div>
      <div class="game-container" *ngIf="isExpanded">
        <app-game
          [quarterId]="quarterId"
          (gameComplete)="onGameComplete($event)">
        </app-game>
      </div>
    </div>
  `,
  styleUrls: ['./game-banner.component.scss']
})
export class GameBannerComponent {
  @Input() quarterId: string = '';
  @Input() quarterName: string = '';
  isExpanded: boolean = false;

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  onGameComplete(score: number): void {
    console.log('Game completed with score:', score);
  }
}