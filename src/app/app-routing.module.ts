import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { PlayerComponent } from './player/player.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { canActivateAdmin, canActivateAuth, canActivateGame } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/player', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent, canActivate: [canActivateAdmin] },
  { path: 'player', component: PlayerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'game', loadChildren: () => import('./shared/game/game.module').then(m => m.GameModule), canActivate: [canActivateGame] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }