import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard, canActivateAdmin, canActivateGame } from './guards/auth.guard';
import { GameComponent } from '../app/shared/game/game.component';
import { PlayerComponent } from './player/player.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: GameComponent },
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
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent },  // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }