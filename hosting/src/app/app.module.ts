// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebase-config'; // Import your config
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [ AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Initialize Firebase
    initializeApp(firebaseConfig);
  }
}
