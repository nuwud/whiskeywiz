import { Injector, NgModule, Input, Component as NgComponent } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { GameComponent } from '../shared/game/game.component';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule
  ],
  providers: []
})
export class GameElementsModule {
  constructor(private injector: Injector) {
    const GameElement = createCustomElement(GameComponent, { injector });
    
    // Check if element is already defined
    if (!customElements.get('whiskey-wiz-game')) {
      customElements.define('whiskey-wiz-game', GameElement);
    }
  }
}

// Then in your quarter component:
@Component({
  selector: 'app-quarter',
  template: `
    <div class="quarter-wrapper">
      <whiskey-wiz-game [quarter]="quarterId"></whiskey-wiz-game>
    </div>
  `
})
export class QuarterComponent {
  @Input() quarterId: string; // Format: "1224" for December 2024
  
  // Add parser to handle different format inputs
  @Input() set quarter(value: string) {
    // Handle both MMYY format and full quarter format
    if (value.length === 4) {
      this.quarterId = value; // Already in MMYY format
    } else {
      // Parse quarter format (e.g., "Q4 2024" to "1224")
      const [quarter, year] = value.split(' ');
      const month = ((parseInt(quarter.substring(1)) - 1) * 3 + 1).toString().padStart(2, '0');
      this.quarterId = `${month}${year.substring(2)}`;
    }
  }
}

export function createGameElement(injector: Injector) {

  // Check if element is already defined
  if (!customElements.get('whiskey-wiz-game')) {
    const GameElement = createCustomElement(GameComponent, { injector });
    customElements.define('whiskey-wiz-game', GameElement);
  }
}

function Component(metadata:any ) {
  return function (target: any) {
    NgComponent(metadata)(target);
  };
}

