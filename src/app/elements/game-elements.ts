import { Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { GameComponent } from '../shared/game/game.component';

export function createGameElement(injector: Injector) {
  const GameElement = createCustomElement(GameComponent, { injector });
  
  // Check if element is already defined
  if (!customElements.get('whiskey-wiz-game')) {
    customElements.define('whiskey-wiz-game', GameElement);
  }
}