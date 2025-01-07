import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

// Firebase imports
import { initializeApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { getFirestore } from '@angular/fire/firestore';
import { getStorage } from '@angular/fire/storage';
import { getAnalytics } from '@angular/fire/analytics';
import { getDatabase } from '@angular/fire/database';

// Initialize Firebase app
const app = initializeApp(environment.firebase);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const database = getDatabase(app);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    AuthModule
  ],
  providers: [
    { provide: 'FIREBASE_APP', useValue: app },
    { provide: 'FIREBASE_AUTH', useValue: auth },
    { provide: 'FIREBASE_FIRESTORE', useValue: firestore },
    { provide: 'FIREBASE_STORAGE', useValue: storage },
    { provide: 'FIREBASE_ANALYTICS', useValue: analytics },
    { provide: 'FIREBASE_DATABASE', useValue: database }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }