import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// Firebase imports
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, Auth } from '@angular/fire/auth';
import { getFirestore, provideFirestore, Firestore } from '@angular/fire/firestore';
import { getStorage, provideStorage, Storage } from '@angular/fire/storage';
import { getAnalytics, provideAnalytics, Analytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getDatabase, provideDatabase, Database } from '@angular/fire/database';
import { environment } from '../environments/environment';

// Feature Modules
import { SharedModule } from './shared/shared.module';
import { QuartersModule } from './quarters/quarters.module';

// Services
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';
import { GameService } from './services/game.service';
import { ScoreService } from './services/score.service';
import { HermonaFontService } from './services/hermona-font.service';
import { QuarterPopulationService } from './services/quarter-population.service';
import { ShopifyService } from './services/shopify.service';

// Initialize Firebase
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
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    QuartersModule,
    
    // Firebase initialization
    provideFirebaseApp(() => app),
    provideAuth(() => auth),
    provideFirestore(() => firestore),
    provideStorage(() => storage),
    provideAnalytics(() => analytics),
    provideDatabase(() => database)
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: Auth, useValue: auth },
    { provide: Firestore, useValue: firestore },
    { provide: Storage, useValue: storage },
    { provide: Analytics, useValue: analytics },
    { provide: Database, useValue: database },
    FirebaseService,
    AuthService,
    GameService,
    ScoreService,
    HermonaFontService,
    QuarterPopulationService,
    ShopifyService,
    ScreenTrackingService,
    UserTrackingService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }