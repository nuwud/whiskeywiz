// src/app/shared/components/game-banner/game-banner.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-banner',
  templateUrl: './game-banner.component.html',
  styleUrls: ['./game-banner.component.scss']
})
export class GameBannerComponent implements OnInit {
  isExpanded = false;
  currentQuarter: string;

  constructor() {}

  ngOnInit() {
    // Get current quarter from your service
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
}