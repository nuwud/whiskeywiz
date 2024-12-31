import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerComponent } from './player.component';
import { SharedModule } from '../shared/shared.module';
import { PlayerRoutingModule } from './player-routing.module';

@NgModule({
  declarations: [
    PlayerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PlayerRoutingModule
  ]
})
export class PlayerModule { }