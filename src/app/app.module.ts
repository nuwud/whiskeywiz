import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuartersModule } from './quarters/quarters.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// Firebase imports
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment';

// Services
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';
import { GameService } from './services/game.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    QuartersModule,
    
    // Firebase initialization
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => getAnalytics()),
    provideDatabase(() => getDatabase())
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    FirebaseService,
    AuthService,
    GameService,
    ScreenTrackingService,
    UserTrackingService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }