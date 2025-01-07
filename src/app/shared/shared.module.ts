import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [GameComponent],
  exports: [GameComponent]
})
export class SharedModule { }