import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AnalyticsComponent } from './analytics/analytics.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { 
        path: 'analytics', 
        component: AnalyticsComponent 
      },
      { 
        path: 'quarters',
        component: AdminComponent
      },
      { 
        path: '', 
        redirectTo: 'quarters', 
        pathMatch: 'full' 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }