import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuarterComponent } from './quarter.component';
import { QuartersComponent } from './quarters.component';

const routes: Routes = [
  {
    path: '',
    component: QuartersComponent  // List available quarters
  },
  {
    path: ':mmyy',  // Using MMYY format (e.g., 0324)
    component: QuarterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuartersRoutingModule { }