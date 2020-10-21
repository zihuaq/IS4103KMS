import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrpDetailsPage } from './hrp-details.page';

const routes: Routes = [
  {
    path: '',
    component: HrpDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrpDetailsPageRoutingModule {}
