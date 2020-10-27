import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewMyFulfillmentsPage } from './view-my-fulfillments.page';

const routes: Routes = [
  {
    path: '',
    component: ViewMyFulfillmentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewMyFulfillmentsPageRoutingModule {}
