import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllMrpsPage } from './view-all-mrps.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllMrpsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllMrpsPageRoutingModule {}
