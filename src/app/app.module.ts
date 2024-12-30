import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment';

// Firebase imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { FirebaseService } from './services/firebase.service';
import { CACHE_SIZE_UNLIMITED } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    // ... other component declarations
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    AngularFireAnalyticsModule
  ],
  exports: [
    SharedModule
    ],
  providers: [
    FirebaseService,
    AuthGuard,
    {
      provide: SETTINGS,
      useValue: {
        ignoreUndefinedProperties: true,
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
        experimentalForceLongPolling: true,
        merge: true
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
