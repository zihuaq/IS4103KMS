import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiveResourceModalPage } from './receive-resource-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiveResourceModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiveResourceModalPageRoutingModule {}
