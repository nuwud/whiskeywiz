import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './shared/game/game.component';
import { ResultsComponent } from './shared/results/results.component';
import { authGuard } from './guards/auth.guard';
import { gameGuard } from './guards/game.guard';
import { QuarterResolver } from './resolvers/quarter.resolver';
import { ErrorComponent } from './shared/error/error.component';

const routes: Routes = [
  { 
    path: 'game', 
    component: GameComponent,
    canActivate: [gameGuard],
    resolve: {
      quarterData: QuarterResolver
    }
  },
  {
    path: 'results/:quarterId',
    component: ResultsComponent,
    canActivate: [gameGuard],
    resolve: {
      quarterData: QuarterResolver
    }
  },
  { 
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard]
  },
  {
    path: 'error',
    component: ErrorComponent,
    data: { message: 'An error occurred' }
  },
  { 
    path: '', 
    redirectTo: '/game', 
    pathMatch: 'full' 
  },
  {
    path: '**',
    redirectTo: '/error',
    data: { message: 'Page not found' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }