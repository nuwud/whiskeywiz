import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GameComponent } from './game/game.component';
import { ResultsComponent } from './results/results.component';
import { ErrorComponent } from './error/error.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule
  ],
  declarations: [
    GameComponent,
    ResultsComponent,
    ErrorComponent,
    SafeUrlPipe
  ],
  exports: [
    GameComponent,
    ResultsComponent,
    ErrorComponent,
    SafeUrlPipe
  ]
})
export class SharedModule { }