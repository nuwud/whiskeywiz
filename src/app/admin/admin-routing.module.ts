import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AdminQuartersComponent } from './quarters/admin-quarters.component';
import { AdminQuarterEditComponent } from './quarters/admin-quarter-edit.component';

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
        children: [
          {
            path: '',
            component: AdminQuartersComponent
          },
          {
            path: 'new',
            component: AdminQuarterEditComponent
          },
          {
            path: ':mmyy/edit',
            component: AdminQuarterEditComponent
          }
        ]
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