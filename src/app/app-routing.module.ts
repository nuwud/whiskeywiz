import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';

// Components
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { PlayerComponent } from './player/player.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { GameComponent } from './shared/game/game.component';
import { LeaderboardComponent } from './shared/leaderboard/leaderboard.component';

// Quarter Components
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

// Services
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';
import { GameService } from './services/game.service';
import { QuarterPopulationService } from './services/quarter-population.service';

// Initialize Firebase
const app = initializeApp(environment.firebase);
const db = getFirestore(app);
const auth = getAuth(app);

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    PlayerComponent,
    LoginComponent,
    RegisterComponent,
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
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    FirebaseService,
    GameService,
    QuarterPopulationService
  ],
  bootstrap: [] // Remove bootstrap array since we're using custom elements
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    // Define all quarter components
    const quarterComponents = {
      'whiskey-wiz-0122': Q0122Component,
      'whiskey-wiz-0322': Q0322Component,
      'whiskey-wiz-0622': Q0622Component,
      'whiskey-wiz-0922': Q0922Component,
      'whiskey-wiz-1222': Q1222Component,
      'whiskey-wiz-0323': Q0323Component,
      'whiskey-wiz-0623': Q0623Component,
      'whiskey-wiz-0923': Q0923Component,
      'whiskey-wiz-1223': Q1223Component,
      'whiskey-wiz-0324': Q0324Component,
      'whiskey-wiz-0624': Q0624Component,
      'whiskey-wiz-0924': Q0924Component,
      'whiskey-wiz-1224': Q1224Component,
      'whiskey-wiz-0325': Q0325Component,
      'whiskey-wiz-0625': Q0625Component,
      'whiskey-wiz-0925': Q0925Component,
      'whiskey-wiz-1225': Q1225Component,
      'whiskey-wiz-0326': Q0326Component,
      'whiskey-wiz-0626': Q0626Component,
      'whiskey-wiz-0926': Q0926Component
    };

    // Register all quarter components
    Object.entries(quarterComponents).forEach(([name, component]) => {
      const element = createCustomElement(component, { injector: this.injector });
      customElements.define(name, element);
    });

    // Register other main components
    const otherComponents = {
      'whiskey-wiz-admin': AdminComponent,
      'whiskey-wiz-player': PlayerComponent,
      'whiskey-wiz-game': GameComponent,
      'whiskey-wiz-leaderboard': LeaderboardComponent,
      'whiskey-wiz-login': LoginComponent,
      'whiskey-wiz-register': RegisterComponent
    };

    Object.entries(otherComponents).forEach(([name, component]) => {
      const element = createCustomElement(component, { injector: this.injector });
      customElements.define(name, element);
    });
  }
}