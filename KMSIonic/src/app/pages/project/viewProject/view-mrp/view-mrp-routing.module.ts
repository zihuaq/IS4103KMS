import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewMrpPage } from './view-mrp.page';

const routes: Routes = [
  {
    path: '',
    component: ViewMrpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewMrpPageRoutingModule {}
