import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GameService } from '../../../services/game.service';
import { FirebaseService } from '../../../services/firebase.service';
import { DataCollectionService } from 'src/app/services/data-collection.service';  

@Component({
  selector: 'app-game-banner',
  template: `
    <div class="banner-container" [class.expanded]="isExpanded">
      <div class="banner-header" (click)="toggleExpand()">
        <h2 class="banner-title font-hermona-2xl">
          {{ quarterName }}
        </h2>
        <div class="banner-controls">
          <span class="expand-icon" [@rotateChevron]="isExpanded ? 'down' : 'up'">▼</span>
        </div>
      </div>

      <div class="banner-content" [@expandCollapse]="isExpanded ? 'expanded' : 'collapsed'">
        <app-game 
          [quarterId]="quarterId"
          *ngIf="isExpanded">
        </app-game>
      </div>
    </div>
  `,
  styleUrls: ['./game-banner.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ]),
    trigger('rotateChevron', [
      state('down', style({ transform: 'rotate(180deg)' })),
      state('up', style({ transform: 'rotate(0deg)' })),
      transition('up <=> down', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ]
})
export class GameBannerComponent implements OnInit {
  @Input() quarterId: string = '';
  @Input() quarterName: string = 'Whiskey Wiz Challenge';
  
  isExpanded = false;
  
  constructor(
    private gameService: GameService,
    private firebaseService: FirebaseService,
    private dataCollection: DataCollectionService
  ) {}
  
  ngOnInit() {
    // Check for saved state
    const savedState = localStorage.getItem(`banner_${this.quarterId}_expanded`);
    if (savedState) {
      this.isExpanded = savedState === 'true';
    }

    // Load quarter data when expanded
    if (this.isExpanded && this.quarterId) {
      this.gameService.loadQuarter(this.quarterId);
    }
  }

  async toggleExpand() {
    this.isExpanded = !this.isExpanded;
    await this.dataCollection.recordInteraction('banner_toggle', {
      quarterId: this.quarterId,
      state: this.isExpanded ? 'expanded' : 'collapsed'
    });
    
    // Save state
    localStorage.setItem(`banner_${this.quarterId}_expanded`, this.isExpanded.toString());
    
    // Load data if expanding
    if (this.isExpanded && this.quarterId) {
      this.gameService.loadQuarter(this.quarterId);
    }
  }
}