import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuarterComponent } from './quarter.component';

const routes: Routes = [
  {
    path: ':quarterId',
    component: QuarterComponent
  },
  {
    path: '',
    redirectTo: '/quarters/current',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuartersRoutingModule { }