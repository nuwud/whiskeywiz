import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateAdmin, canActivateGame } from './guards/auth.guard';
import { GameComponent } from './shared/game/game.component';
import { PlayerComponent } from './player/player.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'quarters', 
    pathMatch: 'full' 
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [canActivateAdmin]
  },
  {
    path: 'quarters',
    loadChildren: () => import('./quarters/quarters.module').then(m => m.QuartersModule)
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
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }