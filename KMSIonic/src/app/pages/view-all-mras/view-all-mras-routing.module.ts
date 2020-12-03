import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllMrasPage } from './view-all-mras.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllMrasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllMrasPageRoutingModule {}
