import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuarterComponent } from './quarters/quarter.component';
import { BaseQuarterComponent } from './quarters/base-quarter.component';
import { QuartersModule } from './quarters/quarters.module';

@NgModule({
  declarations: [
    AppComponent,
    QuarterComponent
  ],
  imports: [
    SharedModule,
    QuartersModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
