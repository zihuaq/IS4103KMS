import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageFulfillmentsModalPage } from './manage-fulfillments-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ManageFulfillmentsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageFulfillmentsModalPageRoutingModule {}
