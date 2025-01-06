import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    GameComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    GameComponent,
    FormsModule
  ]
})
export class SharedModule { }
