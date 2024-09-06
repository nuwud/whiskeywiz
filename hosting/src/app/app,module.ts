// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebase-config'; // Import your config

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Initialize Firebase
    initializeApp(firebaseConfig);
  }
}
