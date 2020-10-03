import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewSdgsPage } from './view-sdgs.page';

const routes: Routes = [
  {
    path: '',
    component: ViewSdgsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSdgsPageRoutingModule {}
