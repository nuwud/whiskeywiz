import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { GameComponent } from '../shared/game/game.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule
  ],
  declarations: [GameComponent],
  providers: []
})
export class GameElementsModule {
  constructor(private injector: Injector) {
    // Match the name used in game-bundle.js
    const elementName = 'whiskey-wiz-game-component';
    if (!customElements.get(elementName)) {
      const GameElement = createCustomElement(GameComponent, { injector });
      customElements.define(elementName, GameElement);
    }
  }

  ngDoBootstrap() {}
}