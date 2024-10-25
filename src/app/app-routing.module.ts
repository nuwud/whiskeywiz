import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { PlayerComponent } from './player/player.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';

// Import all quarter components
import { Q0122Component } from './quarters/0122/0122.component';
import { Q0322Component } from './quarters/0322/0322.component';
import { Q0622Component } from './quarters/0622/0622.component';
import { Q0922Component } from './quarters/0922/0922.component';
import { Q1222Component } from './quarters/1222/1222.component';
import { Q0323Component } from './quarters/0323/0323.component';
import { Q0623Component } from './quarters/0623/0623.component';
import { Q0923Component } from './quarters/0923/0923.component';
import { Q1223Component } from './quarters/1223/1223.component';
import { Q0324Component } from './quarters/0324/0324.component';
import { Q0624Component } from './quarters/0624/0624.component';
import { Q0924Component } from './quarters/0924/0924.component';
import { Q1224Component } from './quarters/1224/1224.component';
import { Q0325Component } from './quarters/0325/0325.component';
import { Q0625Component } from './quarters/0625/0625.component';
import { Q0925Component } from './quarters/0925/0925.component';
import { Q1225Component } from './quarters/1225/1225.component';
import { Q0326Component } from './quarters/0326/0326.component';
import { Q0626Component } from './quarters/0626/0626.component';
import { Q0926Component } from './quarters/0926/0926.component';

const routes: Routes = [
  { path: 'player', component: PlayerComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'quarter/0122', component: Q0122Component },
  { path: 'quarter/0322', component: Q0322Component },
  { path: 'quarter/0622', component: Q0622Component },
  { path: 'quarter/0922', component: Q0922Component },
  { path: 'quarter/1222', component: Q1222Component },
  { path: 'quarter/0323', component: Q0323Component },
  { path: 'quarter/0623', component: Q0623Component },
  { path: 'quarter/0923', component: Q0923Component },
  { path: 'quarter/1223', component: Q1223Component },
  { path: 'quarter/0324', component: Q0324Component },
  { path: 'quarter/0624', component: Q0624Component },
  { path: 'quarter/0924', component: Q0924Component },
  { path: 'quarter/1224', component: Q1224Component },
  { path: 'quarter/0325', component: Q0325Component },
  { path: 'quarter/0625', component: Q0625Component },
  { path: 'quarter/0925', component: Q0925Component },
  { path: 'quarter/1225', component: Q1225Component },
  { path: 'quarter/0326', component: Q0326Component },
  { path: 'quarter/0626', component: Q0626Component },
  { path: 'quarter/0926', component: Q0926Component },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Single default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }