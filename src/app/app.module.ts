import { NgModule, Injector, DoBootstrap, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { BaseQuarterComponent } from './quarters/base-quarter.component';
import { AdminComponent } from './admin/admin.component';
import { PlayerComponent } from './player/player.component';
import { LeaderboardComponent } from './shared/leaderboard/leaderboard.component';
import { LoginComponent } from './auth/login/login.component';
import { GameService } from './services/game.service';
import { FirebaseService } from './services/firebase.service';
import { Q0122Component } from './quarters/0122/0122.component'; import { Q0322Component } from './quarters/0322/0322.component'; import { Q0323Component } from './quarters/0323/0323.component'; import { Q0324Component } from './quarters/0324/0324.component'; import { Q0325Component } from './quarters/0325/0325.component'; import { Q0326Component } from './quarters/0326/0326.component'; import { Q0622Component } from './quarters/0622/0622.component'; import { Q0623Component } from './quarters/0623/0623.component'; import { Q0624Component } from './quarters/0624/0624.component'; import { Q0625Component } from './quarters/0625/0625.component'; import { Q0626Component } from './quarters/0626/0626.component'; import { Q0922Component } from './quarters/0922/0922.component'; import { Q0923Component } from './quarters/0923/0923.component'; import { Q0924Component } from './quarters/0924/0924.component'; import { Q0925Component } from './quarters/0925/0925.component'; import { Q0926Component } from './quarters/0926/0926.component'; import { Q1222Component } from './quarters/1222/1222.component'; import { Q1223Component } from './quarters/1223/1223.component'; import { Q1224Component } from './quarters/1224/1224.component'; import { Q1225Component } from './quarters/1225/1225.component';
import { QuarterPopulationService } from './services/quarter-population.service';
import { RegisterComponent } from './auth/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseQuarterComponent,
    AdminComponent,
    PlayerComponent, 
    LeaderboardComponent, 
    LoginComponent, 
    RegisterComponent,
    Q0122Component, Q0322Component, Q0323Component, Q0324Component, Q0325Component, Q0326Component, Q0622Component, Q0623Component, Q0624Component, Q0625Component, Q0626Component, Q0922Component, Q0923Component, Q0924Component, Q0925Component, Q0926Component, Q1222Component, Q1223Component, Q1224Component, Q1225Component,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    AngularFireAnalyticsModule
  ],
  providers: [GameService, FirebaseService, QuarterPopulationService],
  bootstrap: [AppComponent]
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    // Define all components that will be used as web components
    const webComponents = [
      { name: 'whiskey-wiz-admin', component: AdminComponent },
      { name: 'whiskey-wiz-0122', component: Q0122Component },
      { name: 'whiskey-wiz-0322', component: Q0322Component },
      { name: 'whiskey-wiz-0323', component: Q0323Component },
      { name: 'whiskey-wiz-0324', component: Q0324Component },
      { name: 'whiskey-wiz-0325', component: Q0325Component },
      { name: 'whiskey-wiz-0326', component: Q0326Component },
      { name: 'whiskey-wiz-0622', component: Q0622Component },
      { name: 'whiskey-wiz-0623', component: Q0623Component },
      { name: 'whiskey-wiz-0624', component: Q0624Component },
      { name: 'whiskey-wiz-0625', component: Q0625Component },
      { name: 'whiskey-wiz-0626', component: Q0626Component },
      { name: 'whiskey-wiz-0922', component: Q0922Component },
      { name: 'whiskey-wiz-0923', component: Q0923Component },
      { name: 'whiskey-wiz-0924', component: Q0924Component },
      { name: 'whiskey-wiz-0925', component: Q0925Component },
      { name: 'whiskey-wiz-0926', component: Q0926Component },
      { name: 'whiskey-wiz-1222', component: Q1222Component },
      { name: 'whiskey-wiz-1223', component: Q1223Component },
      { name: 'whiskey-wiz-1224', component: Q1224Component },
      { name: 'whiskey-wiz-1225', component: Q1225Component }
    ];

    // Register each web component
    webComponents.forEach(({ name, component }) => {
      const element = createCustomElement(component, { injector: this.injector });
      customElements.define(name, element);
    });

    // Bootstrap the Angular app if app-root element exists
    const rootElement = document.querySelector('app-root');
    if (rootElement) {
      const applicationRef = this.injector.get(ApplicationRef);
      const componentRef = applicationRef.bootstrap(AppComponent);
    }
  }
}
