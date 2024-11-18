import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { canActivateAdmin, canActivateAuth, combineGuards } from './guards/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { PlayerComponent } from './player/player.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { GameComponent } from './shared/game/game.component';
import { LeaderboardComponent } from './shared/leaderboard/leaderboard.component';
import { ShopifyCallbackComponent } from './auth/shopify-callback/shopify-callback.component';

const routes: Routes = [
  { path: 'admin', 
    component: AdminComponent, 
    canActivate: [combineGuards(canActivateAuth, canActivateAdmin)], 
    children: [
      { path: 'quarter/:id', component: PlayerComponent }
    ] 
  },
  { path: 'player', 
    component: PlayerComponent, 
    canActivate: [canActivateAuth],
    children: [
      { path: 'quarter/:id', component: PlayerComponent }
    ] 
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'game', 
    component: GameComponent,
    children: [
      { path: ':quarter', component: GameComponent }
    ] 
  },
  { path: 'leaderboard', 
    component: LeaderboardComponent, 
    canActivate: [canActivateAuth] 
  },
  { path: 'auth/callback', component: ShopifyCallbackComponent},
  { path: '', redirectTo: '/game', pathMatch: 'full'},
  { path: 'unauthorized', redirectTo: '/player' }, 
  { path: '**', redirectTo: '/game'}

];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
  paramsInheritanceStrategy: 'always',    // Inherit route params from parent routes
  urlUpdateStrategy: 'eager',             // Update URL immediately on navigation
  onSameUrlNavigation: 'reload',          // Allow reloading same route
  initialNavigation: 'enabledBlocking'    // Enable initial navigation
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
  export class AppRoutingModule { }