import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateAdmin, canActivateAuth } from './guards/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { PlayerComponent } from './player/player.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { GameComponent } from './shared/game/game.component';
import { LeaderboardComponent } from './shared/leaderboard/leaderboard.component';

const appRoutes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [canActivateAuth, canActivateAdmin] },
  { path: 'player', component: PlayerComponent, canActivate: [canActivateAuth] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'game', component: GameComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'unauthorized', redirectTo: '/player' }, 
  { path: '**', redirectTo: '/login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }