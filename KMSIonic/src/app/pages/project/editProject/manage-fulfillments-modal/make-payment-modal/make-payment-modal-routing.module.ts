import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MakePaymentModalPage } from './make-payment-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MakePaymentModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakePaymentModalPageRoutingModule {}
