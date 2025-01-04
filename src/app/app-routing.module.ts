import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { canActivateAuth, canActivateAdmin, canActivateGame } from './guards/auth.guard';
import { GameComponent } from './shared/game/game.component';
import { PlayerComponent } from './player/player.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [canActivateAdmin]
  },
  { 
    path: 'game', 
    component: GameComponent,
    canActivate: [canActivateGame]
  },
  { 
    path: 'player', 
    component: PlayerComponent,
    canActivate: [canActivateGame]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }