import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-base-quarter',
  template: `
    <app-game-banner
      [quarterId]="quarterId"
      [quarterName]="quarterName">
    </app-game-banner>
  `
})
export class BaseQuarterComponent {
  @Input() quarterId: string;
  @Input() quarterName: string;

  constructor() {
    this.quarterId = '';
    this.quarterName = '';
  }
}