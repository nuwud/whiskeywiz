import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  @Input() quarterId: string = '';
  @Output() gameComplete = new EventEmitter<number>();

  // Add any additional game logic here
}
