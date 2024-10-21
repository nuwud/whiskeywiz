import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    AppComponent, BaseQuarterComponent, AdminComponent, PlayerComponent, LeaderboardComponent, LoginComponent,
    Q0122Component, Q0322Component, Q0323Component, Q0324Component, Q0325Component, Q0326Component, Q0622Component, Q0623Component, Q0624Component, Q0625Component, Q0626Component, Q0922Component, Q0923Component, Q0924Component, Q0925Component, Q0926Component, Q1222Component, Q1223Component, Q1224Component, Q1225Component,
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
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const el0122 = createCustomElement(Q0122Component, { injector: this.injector }); customElements.define('whiskey-wiz-0122', el0122); const el0322 = createCustomElement(Q0322Component, { injector: this.injector }); customElements.define('whiskey-wiz-0322', el0322); const el0323 = createCustomElement(Q0323Component, { injector: this.injector }); customElements.define('whiskey-wiz-0323', el0323); const el0324 = createCustomElement(Q0324Component, { injector: this.injector }); customElements.define('whiskey-wiz-0324', el0324); const el0325 = createCustomElement(Q0325Component, { injector: this.injector }); customElements.define('whiskey-wiz-0325', el0325); const el0326 = createCustomElement(Q0326Component, { injector: this.injector }); customElements.define('whiskey-wiz-0326', el0326); const el0622 = createCustomElement(Q0622Component, { injector: this.injector }); customElements.define('whiskey-wiz-0622', el0622); const el0623 = createCustomElement(Q0623Component, { injector: this.injector }); customElements.define('whiskey-wiz-0623', el0623); const el0624 = createCustomElement(Q0624Component, { injector: this.injector }); customElements.define('whiskey-wiz-0624', el0624); const el0625 = createCustomElement(Q0625Component, { injector: this.injector }); customElements.define('whiskey-wiz-0625', el0625); const el0626 = createCustomElement(Q0626Component, { injector: this.injector }); customElements.define('whiskey-wiz-0626', el0626); const el0922 = createCustomElement(Q0922Component, { injector: this.injector }); customElements.define('whiskey-wiz-0922', el0922); const el0923 = createCustomElement(Q0923Component, { injector: this.injector }); customElements.define('whiskey-wiz-0923', el0923); const el0924 = createCustomElement(Q0924Component, { injector: this.injector }); customElements.define('whiskey-wiz-0924', el0924); const el0925 = createCustomElement(Q0925Component, { injector: this.injector }); customElements.define('whiskey-wiz-0925', el0925); const el0926 = createCustomElement(Q0926Component, { injector: this.injector }); customElements.define('whiskey-wiz-0926', el0926); const el1222 = createCustomElement(Q1222Component, { injector: this.injector }); customElements.define('whiskey-wiz-1222', el1222); const el1223 = createCustomElement(Q1223Component, { injector: this.injector }); customElements.define('whiskey-wiz-1223', el1223); const el1224 = createCustomElement(Q1224Component, { injector: this.injector }); customElements.define('whiskey-wiz-1224', el1224); const el1225 = createCustomElement(Q1225Component, { injector: this.injector }); customElements.define('whiskey-wiz-1225', el1225);
  }
}
