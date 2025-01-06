import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';
import { ResultsComponent } from './results/results.component';

@NgModule({
  declarations: [
    GameComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    GameComponent,
    ResultsComponent,
    FormsModule
  ]
})
export class SharedModule { }
