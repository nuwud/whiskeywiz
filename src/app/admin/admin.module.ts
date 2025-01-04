import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AdminQuartersComponent } from './quarters/admin-quarters.component';
import { AdminQuarterEditComponent } from './quarters/admin-quarter-edit.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    AdminComponent,
    AnalyticsComponent,
    AdminQuartersComponent,
    AdminQuarterEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AdminRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }