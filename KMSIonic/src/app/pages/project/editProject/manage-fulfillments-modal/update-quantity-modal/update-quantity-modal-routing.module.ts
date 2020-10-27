import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateQuantityModalPage } from './update-quantity-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateQuantityModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateQuantityModalPageRoutingModule {}
