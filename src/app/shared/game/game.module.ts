import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game.component';

const routes: Routes = [];

@NgModule({
  declarations: [GameComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [GameComponent]
})
export class GameModule { }