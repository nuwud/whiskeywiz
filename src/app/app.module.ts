import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthButtonComponent } from './auth/auth-button/auth-button.component';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { PlayerModule } from './player/player.module';
import { AdminNavModule } from './admin-nav/admin-nav.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AuthButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    AdminModule,
    PlayerModule,
    AdminNavModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    AngularFireAnalyticsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }