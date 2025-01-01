import { Injector, NgModule, Input, Component as NgComponent } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { GameComponent } from '../shared/game/game.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    CoreModule
  ],
  providers: []
})
export class GameElementsModule {
  constructor(private injector: Injector) {
    const elementName = 'whiskey-wiz-game';
    if (!customElements.get(elementName)) {
      const GameElement = createCustomElement(GameComponent, { injector });
      customElements.define(elementName, GameElement);
    }
  }

ngDoBootstrap() {}