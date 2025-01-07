import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import { GameComponent } from '../shared/game/game.component';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule
  ]
})
export class GameElementsModule {
  constructor(private injector: Injector) {
    const gameElement = createCustomElement(GameComponent, { 
      injector: this.injector 
    });

    if (!customElements.get('whiskey-wiz-game')) {
      customElements.define('whiskey-wiz-game', gameElement);
    }
  }
}
