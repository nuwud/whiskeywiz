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
}