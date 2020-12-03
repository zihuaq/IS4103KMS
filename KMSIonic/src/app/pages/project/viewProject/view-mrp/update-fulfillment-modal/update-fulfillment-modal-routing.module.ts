import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateFulfillmentModalPage } from './update-fulfillment-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateFulfillmentModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateFulfillmentModalPageRoutingModule {}
