import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminNavComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    AdminComponent,
    AdminNavComponent
  ]
})
export class AdminModule { }