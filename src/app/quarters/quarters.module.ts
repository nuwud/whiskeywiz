import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BaseQuarterComponent } from './base-quarter.component';
import { QuarterComponent } from './quarter.component';

// Import all quarter components
import { Q0122Component } from './0122/0122.component';
import { Q0322Component } from './0322/0322.component';
import { Q0323Component } from './0323/0323.component';
import { Q0324Component } from './0324/0324.component';
import { Q0325Component } from './0325/0325.component';
import { Q0326Component } from './0326/0326.component';
import { Q0622Component } from './0622/0622.component';
import { Q0623Component } from './0623/0623.component';
import { Q0624Component } from './0624/0624.component';
import { Q0625Component } from './0625/0625.component';
import { Q0626Component } from './0626/0626.component';
import { Q0922Component } from './0922/0922.component';
import { Q0923Component } from './0923/0923.component';
import { Q0924Component } from './0924/0924.component';
import { Q0925Component } from './0925/0925.component';
import { Q0926Component } from './0926/0926.component';
import { Q1222Component } from './1222/1222.component';
import { Q1223Component } from './1223/1223.component';
import { Q1224Component } from './1224/1224.component';
import { Q1225Component } from './1225/1225.component';

const QUARTER_COMPONENTS = [
  BaseQuarterComponent,
  QuarterComponent,
  Q0122Component,
  Q0322Component,
  Q0323Component,
  Q0324Component,
  Q0325Component,
  Q0326Component,
  Q0622Component,
  Q0623Component,
  Q0624Component,
  Q0625Component,
  Q0626Component,
  Q0922Component,
  Q0923Component,
  Q0924Component,
  Q0925Component,
  Q0926Component,
  Q1222Component,
  Q1223Component,
  Q1224Component,
  Q1225Component
];

@NgModule({
  declarations: [...QUARTER_COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [...QUARTER_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuartersModule { }
