import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { GameService } from '../services/game.service';
import { HermonaFontService } from '../services/hermona-font.service';
import { QuarterPopulationService } from '../services/quarter-population.service';
import { ScoreService } from '../services/score.service';
import { ShopifyService } from '../services/shopify.service';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    AuthService,
    FirebaseService,
    GameService,
    HermonaFontService,
    QuarterPopulationService,
    ScoreService,
    ShopifyService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it only in AppModule.');
    }
  }
}