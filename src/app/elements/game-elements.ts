import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { GameComponent } from '../shared/game/game.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
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
}