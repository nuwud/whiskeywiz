import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateAdmin, canActivateAuth, combineGuards } from './guards/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { PlayerComponent } from './player/player.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { GameComponent } from './shared/game/game.component';
import { LeaderboardComponent } from './shared/leaderboard/leaderboard.component';
import { ShopifyCallbackComponent } from './auth/shopify-callback/shopify-callback.component';


const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [combineGuards(canActivateAuth, canActivateAdmin)],children: [ { path: 'quarter/:id', component: PlayerComponent }] },
  { path: 'player', component: PlayerComponent, canActivate: [canActivateAuth],                                                                                                                                              children: [{ path: 'quarter/:id', component: PlayerComponent }] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'game', component: GameComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'auth/callback', component: ShopifyCallbackComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'unauthorized', redirectTo: '/player' }, 
  { path: '**', redirectTo: '/login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }