import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BaseQuarterComponent } from './base-quarter.component';
import { Q1225Component } from './1225/1225.component';
// Import other quarter components here

const QUARTER_COMPONENTS = [
  BaseQuarterComponent,
  Q1225Component,
  // Add other quarter components here
];

@NgModule({
  declarations: [...QUARTER_COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [...QUARTER_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuartersModule { }
