import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './shared/game/game.component';
import { LeaderboardComponent } from './shared/leaderboard/leaderboard.component';
import { GameService } from './services/game.service';
import { AdminComponent } from './admin/admin.component';
import { PlayerComponent } from './player/player.component';
import { FirebaseService } from './services/firebase.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { environment } from '../environments/environment';

// Import all quarter components
import { Q0122Component } from './quarters/0122/0122.component';
import { Q0322Component } from './quarters/0322/0322.component';
import { Q0622Component } from './quarters/0622/0622.component';
import { Q0922Component } from './quarters/0922/0922.component';
import { Q1222Component } from './quarters/1222/1222.component';
import { Q0323Component } from './quarters/0323/0323.component';
import { Q0623Component } from './quarters/0623/0623.component';
import { Q0923Component } from './quarters/0923/0923.component';
import { Q1223Component } from './quarters/1223/1223.component';
import { Q0324Component } from './quarters/0324/0324.component';
import { Q0624Component } from './quarters/0624/0624.component';
import { Q0924Component } from './quarters/0924/0924.component';
import { Q1224Component } from './quarters/1224/1224.component';
import { Q0325Component } from './quarters/0325/0325.component';
import { Q0625Component } from './quarters/0625/0625.component';
import { Q0925Component } from './quarters/0925/0925.component';
import { Q1225Component } from './quarters/1225/1225.component';
import { Q0326Component } from './quarters/0326/0326.component';
import { Q0626Component } from './quarters/0626/0626.component';
import { Q0926Component } from './quarters/0926/0926.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    PlayerComponent,
    GameComponent,
    LeaderboardComponent,
    Q0122Component,
    Q0322Component,
    Q0622Component,
    Q0922Component,
    Q1222Component,
    Q0323Component,
    Q0623Component,
    Q0923Component,
    Q1223Component,
    Q0324Component,
    Q0624Component,
    Q0924Component,
    Q1224Component,
    Q0325Component,
    Q0625Component,
    Q0925Component,
    Q1225Component,
    Q0326Component,
    Q0626Component,
    Q0926Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    AngularFireAnalyticsModule
  ],
  providers: [GameService, FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }