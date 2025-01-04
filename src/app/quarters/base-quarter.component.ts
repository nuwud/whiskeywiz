import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-base-quarter',
  template: `
    <app-game-banner
      [quarterId]="quarterId"
      [quarterName]="'Q' + quarterId.substring(0, 1) + ' 20' + quarterId.substring(1)">
    </app-game-banner>
  `
})
export class BaseQuarterComponent {
  @Input() quarterId: string;

  constructor() {
    this.quarterId = '';
  }
}