import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateAdmin, canActivateAuth, combineGuards } from './guards/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { PlayerComponent } from './player/player.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { GameComponent } from './shared/game/game.component';
import { LeaderboardComponent } from './shared/leaderboard/leaderboard.component';

const appRoutes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [canActivateAdmin] },
  { path: 'player', component: PlayerComponent, canActivate: [canActivateAdmin] },
  { path: 'superadmin', canActivate: [combineGuards(canActivateAuth, canActivateAdmin)] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'game', component: GameComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }