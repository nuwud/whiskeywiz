import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game.component';

@NgModule({
  declarations: [GameComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [GameComponent]
})
export class GameModule { }