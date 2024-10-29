import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components for routing
import { AdminComponent } from './admin/admin.component';
import { PlayerComponent } from './player/player.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { GameComponent } from './shared/game/game.component';
import { LeaderboardComponent } from './shared/leaderboard/leaderboard.component';
import { canActivateAdmin, canActivateAuth, combineGuards } from './guards/auth.guard';

const appRoutes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [canActivateAdmin] },
  { path: 'player', component: PlayerComponent, canActivate: [canActivateAdmin] },
  { path: 'superadmin', canActivate: [combineGuards(canActivateAuth, canActivateAdmin)]
  },
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