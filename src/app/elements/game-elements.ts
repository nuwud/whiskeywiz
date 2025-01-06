import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ]
})
export class GameElementsModule {
  constructor(private injector: Injector) {
    // Get GameComponent from SharedModule
    const gameElement = createCustomElement(SharedModule, { injector });
    if (!customElements.get('whiskey-wiz-game')) {
      customElements.define('whiskey-wiz-game', gameElement);
    }
  }
}
