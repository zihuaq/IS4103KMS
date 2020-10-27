import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMraModalPage } from './add-mra-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AddMraModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMraModalPageRoutingModule {}
