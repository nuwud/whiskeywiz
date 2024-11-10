// src/app/shared/components/game-banner/game-banner.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-game-banner',
  templateUrl: './game-banner.component.html',
  styleUrls: ['./game-banner.component.scss'],
  animations: [
  trigger('expandCollapse', [
    state('collapsed', style({
      height: '0',
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
    state('down', style({ transform: 'rotate(0deg)' })),
    state('up', style({ transform: 'rotate(180deg)' })),
    transition('up <=> down', [
      animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
    ])
  ])
]
})

export class GameBannerComponent implements OnInit {
  @Input() quarterId: string = '';
  @Input() quarterName: string = 'Whiskey Wiz';

  isExpanded = false;
  currentQuarter: string;

  constructor() {}

  ngOnInit() {
    // Get current quarter from your service
    console.log('Banner initialized for quarter:', this.quarterId);

  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    console.log('Banner expanded:', this.isExpanded);
  }
}